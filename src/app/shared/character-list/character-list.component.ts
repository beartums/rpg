import { Component, OnInit, OnDestroy, Input, Output, OnChanges,
        EventEmitter, SimpleChanges, HostListener, ViewChild,
      ChangeDetectorRef, HostBinding } from '@angular/core';

import * as _ from 'lodash';

import { Character, STAGE } from '../../character.class';
import { CharacterService } from '../../character.service';

export class CharacterListButton {
	title: string;					// Title text for mouseover
	iconClass: string;			// class to define the icon used to decorate the button
	buttonClass: string;		// ClAss for the button
	// Function (bound to context) where true means don't display
	isHidden?: (character: Character) => boolean;
	// Function (bound to context) where true means don't render
	isGone?: (character: Character) => boolean;
	// Function (bound to context) wwhich executes the button function
	callback: (event: Event, character: Character) => boolean;

	constructor(callback,iconClass,title, buttonClass) {
		this.callback = callback;
		this.buttonClass = buttonClass;
		this.iconClass = iconClass;
		this.title = title;
	}
}

@Component({
  selector: 'character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css','../../app-styles.css']
})
export class CharacterListComponent implements OnInit, OnDestroy, OnChanges {

  @Input() characters: Character[] = [];

	@Input() selectedCharacter: Character;
	@Output() selectedCharacterChange: EventEmitter<Character> = new EventEmitter();

	@Input() buttons: CharacterListButton[]=[];

  @Input() allowSelect: boolean = true;

  @Input() minWidth: number = 400;

  //@Output() allowDragging:

	selectedCharacterKey: string;		// determine equivalence when character is updated from firebase
	showArmoredAc: boolean = true;

  STAGE = STAGE;

  width: number;
  height: number;
  size: string;
  sizes = {
    xs: {min: 0, max: 600},
    sm: {min: 601, max: 959},
    md: {min: 960, max: 1279},
    lg: {min: 1280, max: 1919},
    xl: {min: 1920},
  }

  @HostBinding('style.width.px') hostWidth: number = 600;

  constructor(private cs: CharacterService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

	ngOnChanges(changes: SimpleChanges) {
		for (let prop in changes) {
			if (prop == "selectedCharacter") {
				if (!this.selectedCharacter) {
					this.selectedCharacterKey = null
				}
			}
		}
	}

	ngOnDestroy() {
  }

  ngDoCheck() {
    this.getSize();
  }
  resize(ev) {
    this.getSize();
  //  this.cdRef.markForCheck();
  }
  getSize() {
    let newWidth = this.listTable.nativeElement.clientWidth;
    if (newWidth<+this.minWidth && newWidth<=this.width) {
      this.listTable.nativeElement.setAttribute('width',this.minWidth + 'px');
    }
    this.width = this.listTable.nativeElement.clientWidth;
    this.height = this.listTable.nativeElement.clientHeight;
    this.size = this.setSize(this.width);
    this.cdRef.detectChanges();
  }
  setSize(width:number): string {
    for (let prop in this.sizes) {
      if (this.isBetween(width, prop)) return prop;
    }
    return '';
  }
  isBetween(width:number,size:string): boolean {
    let sizeObj = this.sizes[size];
    if (!sizeObj) return false;
    let max = sizeObj.max || 99999999;
    let min = sizeObj.min || 0;
    return width <= max && width >= min;
  }
  gt(size: string): boolean {
    let obj = this.sizes[size];
    if (!obj) return false;
    return this.width > obj.max;
  }
  ge(size: string): boolean {
    let obj = this.sizes[size];
    if (!obj) return false;
    return this.width >= obj.min;
  }
  lt(size: string): boolean {
    let obj = this.sizes[size];
    if (!obj) return false;
    return this.width < obj.min;
  }
  le(size: string): boolean {
    let obj = this.sizes[size];
    if (!obj) return false;
    return this.width <= obj.max;
  }
  eq(size: string): boolean {
    let obj = this.sizes[size];
    if (!obj) return false;
    return this.width <= obj.max && this.width >= obj.min;
  }

  @ViewChild('listTable')
  listTable;

	@HostListener('window:keydown', ['$event'])
		keyboardInput(event: any) {
			if (!this.allowSelect) return;

			if (["ArrowUp","ArrowDown","Escape"].indexOf(event.key)<0) return;

			switch (event.key) {
				case 'ArrowUp':
					this.gotoAdjacentCharacter(this.selectedCharacterKey,-1);
					break;
				case 'ArrowDown':
					this.gotoAdjacentCharacter(this.selectedCharacterKey,1);
					break;
				case 'Escape':
					this.clearSelected()
					break;
			}
		}

	clearSelected() {
		this.selectedCharacter = null;
		this.selectedCharacterKey = null;
		this.selectedCharacterChange.emit(null);
	}

	getAc(character,useArmor) {
		if (!useArmor) return this.cs.getRawArmorClass(character);
		return this.cs.getArmoredArmorClass(character);
	}

	getAttributeValue(attributeKey,attributes): number {
		if (!attributes) return 0;
		return attributes.find(attribute=> { return attribute.key == attributeKey }).value;
	}

	getButtonClasses(btn: CharacterListButton, character:Character): string {
		let classes = btn.buttonClass || "";
		if (btn.isHidden && btn.isHidden(character)) classes += " invisible";
		return classes;
	}

	getHP(character:Character): string {
		let hp = "";
		if (character.temporaryHitPoints || character.temporaryHitPoints===0) {
			hp = character.temporaryHitPoints + '/';
		}
		hp += character.hitPoints;
		return hp;
	}

	getProgressionIconName(character): string {
		let icons = ['fa-thermometer-empty', 'fa-thermometer-quarter', 'fa-thermometer-half',
							'fa-thermometer-three-quarters', 'fa-thermometer-full'];
		return icons[character.stage];
	}

	gotoAdjacentCharacter(characterKey,moveCount) {
		let character = this.characters.find( c => c.key == characterKey );
		if (!character) return;
		let idx = this.characters.indexOf(character);
		if (moveCount + idx > this.characters.length+1 || moveCount + idx < 0) return;
		this.selectedCharacter = this.characters[moveCount+idx]
		this.selectedCharacterKey = this.selectedCharacter.key;
		this.selectedCharacterChange.emit(this.selectedCharacter);
	}

	select(character: Character) {
		if (!this.allowSelect) return;

		if (this.selectedCharacterKey == character.key) {
			this.clearSelected();
			return;
		}
		this.selectedCharacterKey = character.key;
		this.selectedCharacter = character;
		// necessary because firebase doesn't save empty properties
		//this.setEquipment(character);
		this.selectedCharacterChange.emit(character);
	}

	toggleAcType() {
		this.showArmoredAc = !this.showArmoredAc;
	}

}
