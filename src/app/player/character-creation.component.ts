import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Character, Attribute, STAGE, Gear } from '../character.class';
import { CharacterService } from '../character.service';
import { DataService } from '../data.service';
import { HostListener } from '@angular/core';

@Component({
	selector: 'character-creation',
  templateUrl: './character-creation.component.html',
	styleUrls: ['./character-creation.component.css','../app.component.css'],
	providers: [CharacterService, DataService],
})


export class CharacterCreationComponent implements OnInit {

	character: Character;
	character$: Observable<Character>;
	characterKey: string;
	userId: string;
	gameKey: string;
	
	status: any = this.ds.userData.status;
	
	cart: Set<any> = new Set();
	
	isCartShowing: Boolean = false;
	
	rollCount: number = 0;
	allowedRolls: number = 3;
	
	// for dragging and dropping attributes
	draggingKey: string = '';

	selectedIndex:number;
	
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
				let character = new Character();
				character.userId = this.userId;
				this.characterKey = this.ds.saveCharacter(character);
			} 
			this.character$ = this.ds.fetchCharacter$(this.characterKey);
			
			//this.character$.subscribe( character => {this.character = character} )
		})
	}
	
	arrayFrom<T>(aSet: Set<T>): Array<T> {
		let anArray =  Array.from(aSet);
		return anArray;
	}
	
	setFrom<T>(anArray: Array<T>): Set<T> {
		let aSet =  new Set(anArray);
		return aSet;
	}
	
	generateAttributes(character:Character): void {
		character.attributes = this.cs.generateAttributesArray();
		this.selectedIndex = null;
		character.attributeRolls++
		// save values
		this.ds.updateCharacter(character);
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
		attributes.find( a => a.key == key )
		return null;
	}

	getAttributeRaceMod(attributeKey: string, raceName: string, className?: string): number {
		if (!raceName) return 0;
		return this.cs.getAttributeRaceMod(attributeKey, raceName, className)
	}

	getCartWeight(cart: Set<Gear>): number {
		let totWeight = 0;
		cart.forEach((item) => {
			if (item.pounds && !isNaN(item.pounds)) {
			 totWeight += item.pounds * item.count;
			}
		});
		return totWeight
	}	

	getCartValue(cart: Set<Gear>): number {
		let totVal = 0;
		cart.forEach(item=> {
			if (item.cost) {
				let denom = this.ds.getDenomination(item.denomination);
				let dVal = denom && denom.value ? denom.value : 1;
				totVal += item.cost * item.count * dVal;
			}
		});
		return totVal;
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
		if (!character.attributes) return [];
		let className = character.className || "";
		className = className.length==0 ? null : className;
		let raceName = raceNameOverride || character.raceName || "";
		let validity: any = this.cs
								.getValidity(character.attributes,className,raceName);
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
		//this.ds.updateCharacter(this.character);

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
		[sourceAttribute.value, targetAttribute.value] = 
				[targetAttribute.value, sourceAttribute.value];
		/**
		let hold = sourceAttribute.value;
		sourceAttribute.value = targetAttribute.value;
		targetAttribute.value = hold;
		**/
		//this.ds.updateCharacter(this.character);

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
			this.clearDetails(character) // make sure the details are nulled
			character.stage = STAGE.Attributes;
		} else {
			character.stage = STAGE.Details;			
		}
		this.ds.updateCharacter(character);
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
			if (!character.equipment) character.equipment = {gear:[]};
			character.equipment.gear = [];
			character.stage = STAGE.Details;			
		}
		this.ds.updateCharacter(character);
	}
	
	toggleEquipmentStage(character: Character) {
		if (character.stage > STAGE.Spells ||
				character.stage < STAGE.Details) return;
				
		if (character.stage == STAGE.Equipment) {

			if (this.cart.size > 0) {
				this.clearCart(this.cart);
			}
			character.stage = STAGE.Spells;
		} else {
			character.stage = STAGE.Equipment;
		}
		this.ds.updateCharacter(character);
		this.isCartShowing = false;
	}
	
	showCart(cart: Set<Gear>, character: Character) {
		cart = cart || this.cart;
		if (this.isCartShowing) this.clearCart(cart);
		this.isCartShowing=!this.isCartShowing;
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
	
	clearCart(cart: Set<Gear>, skipConfirmation?: boolean): Promise<Boolean> {
		cart.forEach(item=> {
			delete item.count;
			cart.delete(item)
		});
		
		return new Promise(resolve => resolve(true));

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
	
	isCartBuyable(cart: Set<Gear>): boolean {
		return cart.size>0;
	}

	buyCart(cart: Set<Gear>, character: Character): string {
		cart = cart || this.cart;
		character = character || this.character;
		let cost = this.getCartValue(cart);
		if (cost > character.gold) return 'you don\'t have enough gold';
		// will be encumbered, warn
		if (!character.equipment) character.equipment = {gear: new Array()};
		if (!character.equipment.gear) character.equipment.gear = new Array();
		let gear = new Set(character.equipment.gear);
		cart.forEach(item=> {
			let newItem = Object.assign({},item);
			let oldItem = this.findMatchingItem(newItem,gear);
			if (oldItem) oldItem.count += newItem.count
			else gear.add(newItem);
		});
		this.clearCart(cart);
		character.gold -= cost;
		character.equipment.gear = Array.from(gear);
	}
	
	findMatchingItem(item: Gear, gear: Set<Gear>): any {
		let keys = Object.keys(item);
		let equipment = Array.from(gear);
		let match = equipment.find( g => {
			return keys.reduce( ( isMatch, key ) => {
									if (!isMatch) return isMatch;
									if (key == 'count') return true;
									return g[key] == item[key];
			}, true );
		});
		return match;
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

	/**
	 * Select an attribute index to be moved by keyboard arrows
	 * @param {number} idx Index of the attribute to be moved
	 */
	selectIndex(idx: number, character:Character): void {
		if (character.stage != STAGE.Attributes) return;
		if (this.selectedIndex == idx) this.selectedIndex = null;
		else this.selectedIndex = idx;
	}
	
	isIn(a: any[], lookup: any): boolean {
		if (!a || !a.length) return true;
		for (let i = 0; i < a.length; i++) {
			if (a[i]==lookup) return true
		}
		return false;
	}
}
