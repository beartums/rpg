import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Character, Attribute, STAGE } from '../../character.class';
import { CharacterService } from '../../character.service';
import * as _ from 'lodash';


@Component({
  selector: 'create-character-details',
  templateUrl: './create-character-details.component.html',
  styleUrls: ['./create-character-details.component.css']
})
export class CreateCharacterDetailsComponent implements OnInit {

	@Input() character: Character;
	@Output() characterChanges: EventEmitter<Character> = new EventEmitter();
	
	@Input() allowedRolls: number;
	
	@Output() onDetailsToggled: EventEmitter<Character> = new EventEmitter();
	
	@Input() status;
	
	STAGE = STAGE;
	
  constructor(private cs: CharacterService) { }

  ngOnInit() {
  }
	
		
	adjustCharacterAttributes(oldRace: string, character:Character) {
		let newRace = character.raceName
		if (oldRace) {
			character.attributes = this.cs.getAdjustedAttributes(character.attributes,
						oldRace, character.className, true);
		}
		if (newRace) {
			character.attributes = this.cs.getAdjustedAttributesByCharacter(character);
		}
		return character;
	}
	
	generateName(character: Character): void {
		let raceName = character.raceName;
		let gender = character.gender;
		gender = (gender !== 'Male' && gender !== 'Female') ? null : gender;

		try {
			let fName = this.cs.generateName(raceName,gender);
			let lName = this.cs.generateName(raceName,'family');
			character.name = fName + ' ' + lName;
		} catch(e) {
			console.log(e);
		}
	}

	getAdjustedAttributes(character: Character): Attribute[] {
		let attributes = character.attributes;
		let raceName = character.raceName
		if (!attributes || attributes.length < 1) return [];
		if (!raceName) return attributes;
		attributes = attributes.map(a=> {
			a.value = +a.value;
			return a
		}); 
		return this.cs.getAdjustedAttributes(attributes, raceName);
	}

	getAttribute(attributes: Attribute[], key: string): Attribute {
		return attributes.find( a => a.key == key )
		//return null;
	}

	getAttributeRaceMod(attributeKey: string, raceName: string, className?: string): number {
		if (!raceName) return 0;
		return this.cs.getAttributeRaceMod(attributeKey, raceName, className)
	}
		
	getCharacterDescription(character: Character): string {
		let cRace = this.cs.getRace(character.raceName);
		let gender = (character.gender == 'Male' || character.gender == 'Female') 
									? character.gender : 'Gender-fluid';
		let raceAdjective = cRace.adjective;
		
		let description = "a " + character.alignmentLaw + "/" + character.alignmentGood;
		description += ", " + raceAdjective;
		description += ", " + gender;
		description += " " + character.className
		
		return description;
		
	}
	getClassValidity(character: Character, classNameOverride): any {
		if (!character.attributes) return [];
		let raceName = character.raceName || "";
		let className = classNameOverride || character.className || "";
		raceName = raceName.length==0 ? null : raceName;
		let validity: any = this.cs
								.getValidity(character.attributes,className,raceName);
		return validity.meetsClassRequirements;
	}

	getRaceValidity(character: Character, raceNameOverride): any {
		let thisChar = _.cloneDeep(character);
		if (!thisChar.attributes) return [];

		// Need to adjust attributes for race (unadjust and readjust, if needed)
		if (raceNameOverride) {
			let oldRace = thisChar.raceName;
			thisChar.raceName = raceNameOverride;
			thisChar = this.adjustCharacterAttributes(oldRace,thisChar)
		}
			
		let className = thisChar.className || "";
		className = className.length==0 ? null : className;
		let raceName = raceNameOverride || thisChar.raceName || "";
		let validity: any = this.cs
								.getValidity(thisChar.attributes,className,raceName);
		return validity.meetsRaceRequirements;
	}

	getValidClasses(character: Character): any[] {
		let raceName = character.raceName;
		let classes = this.cs.getClasses();
		let validClasses: any[] = [];
		for (let i = 0; i < classes.length; i++) {
			if (this.getClassValidity(character, classes[i].name)) {
				validClasses.push(classes[i]);
			}
		}
		return validClasses;

	}

	/**
	 * Get a list of the valid races for the specified class
	 * @param  {string} className (optional) Name of class chosen
	 * @return {any[]}            array of valid race objects
	 */
	getValidRaces(character: Character): any[] {
		let className = character.className;
		let races = this.cs.getRaces();
		let validRaces: any[] = [];
		for (let i = 0; i < races.length; i++) {
			if (this.getRaceValidity(character, races[i].name)) {
				validRaces.push(races[i]);
			}
		}
		return validRaces;
	}

	toggleDetailsStage(character: Character) {
		if (character.stage == STAGE.Attributes) return;
		// if stage is details, then moving on to completed
		else if (character.stage == STAGE.Details) {
			this.generateBeginningBalances(character);
			character.stage = STAGE.Equipment;
			character.xpRolls++;
		// if stage is completed, then move back to details
		} else {
			this.clearBeginningBalances(character);
			if (!character.equipment) character.equipment = [];
			//character.equipment.gear = [];
			character.stage = STAGE.Details;			
		}
		this.onDetailsToggled.emit(character);
	}

	generateBeginningBalances(character: Character) {
			// generate starting gold (with a little bit of luck thrown in
			let luck = this.cs.roll('1d10');
			let luckMultiplier = luck == 1 ? 1 :
														luck == 10 ? 100 : 10;
			character.gold = this.cs.roll('3d6') * luckMultiplier;
			// Generate Starting XP
			luck = this.cs.roll('1d10');
			luckMultiplier = luck == 1 ? 1 :
														luck == 10 ? 100 : 10;
			character.experiencePoints = this.cs.roll('5d6k3') * luckMultiplier;
			character.level = 
					this.cs.getClassLevel(character.className,character.experiencePoints);
			character.hitPoints = 
					this.cs.generateHitPoints(character.className, character.level,
									this.getAdjustedAttributes(character));
	}
	
	clearBeginningBalances(character: Character) {
		character.experiencePoints = 0;
		character.gold = 0;
		character.level = 1;
		character. hitPoints = 0;
	}
		
	isDetailsValid(character: Character): boolean {
		if (!character.gender) return false;
		if (!character.className) return false;
		if (!character.raceName) return false;
		if (!character.alignmentLaw) return false;
		if (!character.alignmentGood) return false;
		if (!character.name) return false;
		return true;
	}
		
	/**
	 * Clear the detail fields
	 */
	clearDetails(character: Character): void {
		character.raceName = null;
		character.className = null;
		character.gender = null;
		character.alignmentGood = null;
		character.alignmentLaw = null;
		character.name = null;
		character.nickname = null;
	}



}
