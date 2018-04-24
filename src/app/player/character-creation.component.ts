import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Character, Attribute, STAGE, Gear } from '../character.class';
import { CharacterService } from '../character.service';
import { DataService } from '../data.service';
import * as _ from 'lodash'; 

@Component({
	selector: 'character-creation',
  templateUrl: './character-creation.component.html',
	styleUrls: ['./character-creation.component.css','../app.component.css'],
	providers: [CharacterService, DataService],
})


export class CharacterCreationComponent implements OnInit {

	character: Character;
	characterKey: string;
	userId: string;
	gameKey: string;
	
	status: any = this.ds.userData.status;
	
	rollCount: number = 0;
	allowedRolls: number = 3;
	
	STAGE = STAGE;
	JSON = JSON;
	isNaN = isNaN;

	constructor(private cs: CharacterService, private ds: DataService,
							private router: Router, private route: ActivatedRoute) {
	}
	
	ngOnInit() {
		this.route.paramMap.subscribe( params => {
			this.characterKey = params.get('key');
			this.userId = params.get('userId');
			this.gameKey = params.get('gameKey');
			if (this.characterKey == 'new') {
				this.character = new Character();
				this.character.userId = this.userId;
				this.characterKey = null;
			} else {
				// Have to subscribe rather than using async because otherwise cannot
				// access the character in the drag and drop functionality (async as
				// works ina separate scope)
				this.ds.fetchCharacter$(this.characterKey).take(1)
							.subscribe(c=>this.character = c);
			}
		})
	}
	
	ngOnDestroy() {
		//this.subscription.unsubscribe();
	}
	
	saveProgress(character) {
		if (!this.characterKey) {
			this.characterKey = this.ds.saveCharacter(character);
			character.key = this.characterKey;
		}	else {
			this.ds.updateCharacter(character);
		}
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
		let cRace = this.ds.getRace(character.raceName);
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
		let classes = this.ds.getClasses();
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
		let races = this.ds.getRaces();
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
		this.saveProgress(character);
	}
	
	toggleEquipmentStage(character: Character) {
		if (character.stage > STAGE.Spells ||
				character.stage < STAGE.Details) return;
				
		if (character.stage == STAGE.Equipment) {
			// HACKY: spell progression tables will be null if there are no current spells
			// for this character
			character.stage = this.cs.getSpellProgressionTable(character) ? STAGE.Spells : STAGE.Complete;
		} else {
			character.stage = STAGE.Equipment;
		}
		this.saveProgress(character);
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

	
	isIn(a: any[], lookup: any): boolean {
		if (!a || !a.length) return true;
		for (let i = 0; i < a.length; i++) {
			if (a[i]==lookup) return true
		}
		return false;
	}
}
