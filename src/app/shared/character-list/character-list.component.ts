import { Component, OnInit, Input, Output, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';

import * as _ from 'lodash';

import { Character } from '../../character.class';
import { CharacterService } from '../../character.service';

export class CharacterListButton {
	title: string;
	iconClass: string;
	buttonClass: string;
	callback;
	
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
export class CharacterListComponent implements OnInit {

  @Input() characters: Character[] = [];
	
	@Input() selectedCharacter: Character;
	@Output() selectedCharacterChange: EventEmitter<Character> = new EventEmitter();
	
	@Input() buttons: CharacterListButton[]=[];
	
	@Input() allowSelect: boolean = true;
	
	selectedCharacterKey: string;
	showArmoredAc: boolean = true;
	
	constructor(private cs: CharacterService) { }

  ngOnInit() {
  }

	clearSelected() {
		this.selectedCharacter = null;
		this.selectedCharacterKey = null;
	}
	
	getAc(character,useArmor) {
		if (!useArmor) return this.cs.getRawArmorClass(character);
		return this.cs.getArmoredArmorClass(character);
	}
	
	getAttributeValue(attributeKey,attributes): number {
		if (!attributes) return 0;
		return attributes.find(attribute=> { return attribute.key == attributeKey }).value;
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
		let icons = ['fa-hourglass-o', 'fa-hourglass-start', 'fa-hourglass-half',
							'fa-hourglass-end', 'fa-hourglass'];
		return icons[character.stage];
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
