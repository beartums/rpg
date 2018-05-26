import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Character, Attribute, STAGE} from '../../character.class';
import { CharacterService } from '../../character.service';
import { HostListener } from '@angular/core';
import * as _ from 'lodash'; 

@Component({
  selector: 'create-character-attributes',
  templateUrl: './create-character-attributes.component.html',
  styleUrls: ['./create-character-attributes.component.css']
})
export class CreateCharacterAttributesComponent implements OnInit {

	@Input() character: Character;
	@Output() characterChange: EventEmitter<Character> = new EventEmitter();
	
	@Input() status;
	
	@Input() allowedRolls: number;
	
	@Output() onAttributesGenerated: EventEmitter<Character> = new EventEmitter();
	
	@Output() onAttributesUnlocked: EventEmitter<Character> = new EventEmitter();
	
	@Output() onAttributesLocked: EventEmitter<Character> = new EventEmitter();
	
	selectedIndex: number; 	// for keyboard swapping of attributes
	draggingKey: string; 		// For dragging and dropping attributes
	
	STAGE = STAGE;
	
  constructor(private cs: CharacterService) { }

  ngOnInit() {
		console.log(this);
  }
	
	generateAttributes(character:Character): void {
		character.attributes = this.cs.generateAttributesArray();
		this.selectedIndex = null;
		character.attributeRolls++;
		// $|async as character NOT setting this.character.
		//this.character = character;
		// save values
		this.onAttributesGenerated.emit(character);
		//this.saveProgress(character);
	}
	getAttribute(attributes: Attribute[], key: string): Attribute {
		return attributes.find( a => a.key == key )
		//return null;
	}

		@HostListener('window:keydown', ['$event'])
/**
 * Listen for keyboard shortcuts
 * @param  {any}    event Keyboard event object
 * @return {void}
 */
	keyboardInput(event: any) {

		// if nothing is selected, or the pressed key is not one we are capturing
		// just return.
		if (!this.selectedIndex && this.selectedIndex!==0) return;
		if (event.key!="ArrowDown" && event.key!="ArrowUp" && event.key !="Escape") return;

		// prevent any other DOM element from capturing
		event.preventDefault();

		// Unselect all attributes on Escape
		if (event.key=="Escape") {
				this.selectedIndex = null;
				return;
		}

		// keydown moves the attribute value to the next attribute,
		// keyup moves it to the previous attribute
		let a = this.character.attributes[this.selectedIndex];
		let newIndex: number

		if (event.key == "ArrowDown") {
		 	if (this.selectedIndex >= this.character.attributes.length-1) return;
			newIndex = this.selectedIndex + 1;
		} else if (event.key=="ArrowUp") {
			if (this.selectedIndex <1) return;
			newIndex = this.selectedIndex-1;
		}

		// swap values
		let b = this.character.attributes[newIndex];
		let c = a.value;
		a.value = b.value;
		b.value = c;
		// move selection to the attribute that got the moving value
		this.selectedIndex = newIndex;
		this.characterChange.emit(this.character);
	}

	/**
	 * Handle the dropping of an attribute from drag and dropping:
	 * swap the value of the dropped att with the target att
	 * @param {any} event Event object
	 */
	drop(event:any): void {
		//console.log(event);
		// get the target attribute
		let key = event.srcElement.id;
		let targetAttribute = this.getAttribute(this.character.attributes, key);
		// gt the source attribute
		//key = event.dragData.key;
		key = this.draggingKey;
		let sourceAttribute = this.getAttribute(this.character.attributes, key);
		this.draggingKey = '';
		
		if (!targetAttribute || !sourceAttribute || sourceAttribute == targetAttribute) return;
		//[sourceAttribute.value, targetAttribute.value] = 
		//		[targetAttribute.value, sourceAttribute.value];
		let hold = sourceAttribute.value;
		sourceAttribute.value = targetAttribute.value;
		targetAttribute.value = hold;
		
		this.characterChange.emit(this.character);

	}
	
	dragStart(event: any) {
		//console.log(event);
		this.draggingKey = event.srcElement.id;
	}
	allowDrop(event) {
		event.preventDefault();
	}
	
	toggleAttributeStage(character) {
		// if stage is completed, cannot toggle the attributes
		if (character.stage > STAGE.Equipment) return;
		// if stage is details, then moving back to attributes
		else if (character.stage == STAGE.Details) {
			character.stage = STAGE.Attributes;
			this.onAttributesUnlocked.emit(character);
		} else {
			character.stage = STAGE.Details;
			this.onAttributesLocked.emit(character);
		}
		this.characterChange.emit(character);
	}


}
