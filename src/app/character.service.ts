import { Injectable, Inject } from '@angular/core';

import { Table, TableValueRow } from './table.class';
import { TableService} from './shared/table.service';
import { Roll } from './shared/roll';
import { Character, Attribute, SavingThrowDetail, Armor, Gear,
					GEAR_STATUS} from './character.class';
import { DataService } from './data.service';
import { CaseConvertPipe } from './shared/case-convert.pipe';

@Injectable()
export class CharacterService {

	constructor(@Inject(DataService) private ds: DataService,
              private caseConvert: CaseConvertPipe,
              private ts: TableService) {}

  /**
   * Add the values for int/wis additonal spells to the table
   *
   * @param {Table} spellProgressionTable
   * @param {Character} character
   * @returns Updated spell progression table
   *
   * @memberOf CharacterService
   */
  addAdditionalSpells(spellProgressionTable: Table, character: Character): Table {
		let spt = Object.assign({},spellProgressionTable);
		let attributeKey = 'WIS'
		let attributes = this.getAdjustedAttributesByCharacter(character);
		let attribute = this.getAttributeByAttributeKey(attributeKey,attributes);
		let additionalSpellsMod = this.getAbilityModByAbility('additionalSpells',
													attribute.key, attribute.value);
		if (!additionalSpellsMod) return spt;

		let additionalSpells = additionalSpellsMod.value;
		// Additional spells are ONLY available if Cleric/Druid can memorizze
		// AT LEAST one spell of that level

		Object.keys(spt).forEach(key => {
			let level:number = +key;
			if (spt[level] > 0 && additionalSpells.length >= level) {
				spt[level] += additionalSpells[level-1];
			}
		});
		return spt;
	}

  /**
   * Generate a single attriute
   *
   * @param {string} key Key of the attribute to create
   * @param {string} [rollNotation='5d6k3'] What kinf of roll to use
   * @returns {Attribute} Attribute with it's value
   *
   * @memberOf CharacterService
   */
	generateAttribute(key: string, rollNotation: string = '5d6k3'): Attribute {
		let attribute = new Attribute(key, Roll.roll(rollNotation));
		return attribute;
	}

	generateAttributesArray(rollNotation: string='5d6k3'): Attribute[] {
		let attributes: Attribute[] = [];
		for (let key in this.ds.Attributes) {
			attributes.push(this.generateAttribute(key, rollNotation));
		}
		return attributes;
	}

	generateEmptyAttributesArray(): Attribute[] {
		let attributes: Attribute[] = [];
		for (let key in this.ds.Attributes) {
			attributes.push({key: key, value:0});
		}
		return attributes;
	}

	/**
	 * Generate character hit points based on class and level
	 * @param  {string} characterClassName "name" property from character class"
	 * @param  {number} characterLevel     Level
	 * @return {number}                    Randomized hit point value
	 */
	generateHitPoints(characterClassName: string, characterLevel: number, attributes: Attribute[]): number {
			let characterClass = this.ds.getClass(characterClassName);
			let hpSpecs = this.getClassLevelHpSpecs(characterClassName,characterLevel);
			if (!characterClass) {
				console.log(`invalid character class name (${characterClassName}). Defaulting to d6`);
				hpSpecs.sides = 6
			}
			if (!characterLevel || characterLevel < 1) {
				console.log(`invalid character level (${characterLevel}).  Defaulting to 1`);
				hpSpecs.dice = 1
			}
			let con = this.ds.getObjectByProperty(attributes,'key','CON');
			let mod = this.getAbilityModByAbility('hitPointsPerDie',con.key,con.value);
			let modifier = mod.value * hpSpecs.dice + hpSpecs.points;
			// explicitly add + so that roll notation is correct
			let rollNotation = `${hpSpecs.dice}d${hpSpecs.sides}`;
			if (modifier && modifier != 0) {
				mod = modifier > 0 ? '+' + modifier.toString() : modifier.toString();
				rollNotation += mod;
			}
			return Roll.roll(rollNotation);
		}

	/**
	 * Get an random name for the character
	 * @param  {string} race String key for the race
	 * @param  {string} type Type of name to get: male, female, family
	 * @return {string}      Random name
	 */
	generateName(race: string, type?: string): string {
		race = race.toLowerCase();
		let halfRaceName = this.getHalfRace(race);
		let races = halfRaceName ? [halfRaceName, 'human'] : [race];
		let names = [];
		races.forEach(raceName => {
			let raceObj: any = this.ds.Names[raceName];
			if (!raceObj) throw `invalid race (${race})`;
			if (type) {
				type = type.toLowerCase();
				names = names.concat(raceObj[type]);
				if (!names) throw `invalid name type (${type})`;
			} else {
				names = names.concat(raceObj.male.concat(raceObj.female));
			}
		});

		let idx: number = Math.floor(Math.random() * names.length);
		let name = names[idx];
		return name;
	}

	/**
	 * Get ability Modification Values
	 * @param  {string} attributeKey Attribute key
	 * @param		{number}	attributeValue	Valu eof Attribute
	 * @return {any[]}                Arrary of ability modifiers
	 */
	getAbilityModsByAttribute(attributeKey:string, attributeValue:number): any[] {
		let abilityMods: any[] = [];
		for (let abilityKey in this.ds.AttributeAbilityModifiersXref) {
			let ability = this.getAbilityModByAbility(abilityKey, attributeKey, attributeValue);
			if (ability) abilityMods.push(ability);
		}
		return abilityMods;
	}

	getAbilityModByAbility(abilityKey: string, attributeKey: string, attributeValue: number): any {
		let ability = this.ds.AttributeAbilityModifiersXref[abilityKey];
		if (!ability) return null;
		if (ability.attribute !== attributeKey) return null;
		let table: any[] = this.ds.AttributeAbilityModifiers[ability.key];
		if (!table) return null;
		let value: any = table[attributeValue];
		if (value !== 0 && !value) return null;
		if (abilityKey == 'Proficiency') {
			value = this.ds.LanguageProficiency[value];
		}
		return {ability: abilityKey, attribute: attributeKey, value: value};
	}

	/**
	 * Get a copy of the attributes array, adjusted for race modifiers
	 * @param  {Attribute[]} attributes Raw attributes
	 * @param  {string}      raceName   Name of the race
	 * @return {Attribute[]}            Attribute array, adjusted with race modifiers
	 **/
	getAdjustedAttributes(attributes: Attribute[], raceName: string, className?: string,
												reverseAdjustment: boolean = false): Attribute[] {

		let adjustedAttributes: Attribute[] = [];
		let reverseMod = reverseAdjustment ? -1 : 1

		for (let i = 0; i < attributes.length; i++ ) {
			let attribute = attributes[i];
			let mod = this.getAttributeRaceMod(attribute.key,raceName,className) * reverseMod;
			adjustedAttributes.push(new Attribute(attribute.key, attribute.value + mod ));
		}
		return adjustedAttributes;
	}

	getAdjustedAttributesByCharacter(character: Character, reverseAdjustment: boolean = false): Attribute[] {
		let attributes = this.getAdjustedAttributes(character.attributes,
												character.raceName, character.className, reverseAdjustment);
		return attributes;
	}

	getAlignments(prop?: string): any {
		return this.ds.getAlignments(prop);
	}

	getArmorClassAbilityMod(character: Character): number {
		let attributes = this.getAdjustedAttributesByCharacter(character);
		let dex = this.getAttributeByAttributeKey('DEX',attributes);
		let mod = this.getAbilityModByAbility('armorClass',dex.key,dex.value);
		return mod.value;
	}

	getArmoredArmorClass(character: Character): number {
		if (!character.equipment || !character.equipment.filter) return this.getRawArmorClass(character);
		let gear = character.equipment;
    let armor = gear.filter(item=>item.type=='Armor');
    armor = armor.filter(item=>item.status==GEAR_STATUS.InUse);
		let baseAc = armor.reduce((ac,item:Armor)=> {
					//if (item.status != GEAR_STATUS.InUse || !item.armorClass) return ac;
					if (!item.armorClass) return ac;
					return item.armorClass<ac ? item.armorClass : ac
				},this.ds.getBaseArmorClass());
		let armorMods = armor.reduce((mod,item:Armor)=> {
					if (item.status != GEAR_STATUS.InUse || !item.armorClassMod) return mod;
					return item.armorClassMod ? mod + item.armorClassMod : mod
				}, 0);
		let abilityMod = this.getArmorClassAbilityMod(character);
		let ac = +baseAc + armorMods + abilityMod;
		return ac;
	}

	getAttributeAbilityModList(adjustedAttributes: Attribute[]): any[] {
		let xref = this.ds.AttributeAbilityModifiersXref;
		let mods: any[] = [];
		for (let prop in xref) {
			let lookup = this.ds.AttributeAbilityModifiers[xref[prop].key];
			let attribute: Attribute = this.ds.getObjectByProperty(adjustedAttributes, 'key', xref[prop].attribute);
			let mod: any = {};
			mod.name = prop;

			if (prop=='languageProficiency') {
				mod.description = this.ds.LanguageProficiency[lookup[attribute.value]];
				mod.value = 1;
			} else if (prop=='additionalSpells') {
				mod.description = lookup[attribute.value];
				if (!mod.description) continue;
				mod.description = this.stringifyArrayOrdinally(mod.description);
				mod.name = prop + 'ByLevel';
				mod.value = 1;
			} else {
				mod.value = lookup[attribute.value] * (xref[prop].isPercent ? 100 : 1);
			}

			mod.type = xref[prop].type;
			mod.isPercent = xref[prop].isPercent;
			mod.classes = xref[prop].classes;
			mods.push(mod);
		}
		return mods;
	}

	getAttributeByAttributeKey(attributeKey: string, attributes: Attribute[]): Attribute {
		for (let i = 0; i < attributes.length; i++) {
			if (attributes[i].key == attributeKey) return attributes[i];
		}
		throw `Attribute Key '${attributeKey}' not found in the passed attribute list`;
	}

	getAttributeRaceMod(attributeKey: string, raceName: string, className?: string): number {
		let race = this.ds.getRace(raceName);
		if (!race) return 0;

		let cClass = this.ds.getClass(className);
		//if (className && !cClass) throw `Invalid class Name (${className})`;

		let attributeEffect = race ? race.attributeEffects[attributeKey] : 0;
		if (race && !attributeEffect) throw `Attribute key not found (${attributeKey})`;

		let negateMods = cClass && cClass.ignoreAttributeMods && cClass.ignoreAttributeMods[attributeKey];

		return negateMods ? 0 : attributeEffect.modValue;
	}

	getClass(className: string): any {
		return this.ds.getClass(className);
	}

	getClasses(): any[] {
		return this.ds.getClasses();
	}

	getClassLevel(className: string, xp: number): number {
		let levels = this.getClass(className).levelProgression;
		for (let i = 0; i < levels.length; i++) {
			let level = levels[i];
			if (level.xpMin > xp) {
				// assumin XP is never less than 0
				if (i>0) return levels[i-1].level
				else return 0;
			}
		}
		return levels[length-1].level;
	}

	getClassLevelHpSpecs(className: string, level: number): any {
		let cClass = this.getClass(className);
		let levels = cClass.levelProgression;
		let spec = { dice: 0, points: 0, sides: cClass.hitDieSides }
		let i = 0;
		while (level>=levels[i].level) {
			let levelSpec = levels[i];
			spec.dice += levelSpec.addHpType == 'd' ? levelSpec.addHpQty : 0
			spec.points += levelSpec.addHpType == 'p' ? levelSpec.addHpQty : 0
			if (++i>levels.length) return spec;
		}
		return spec;
	}

	getHalfRace(raceName: string): string {
		let halfRace: string = raceName.replace('half-','');
		if (halfRace==raceName) return null;
		return halfRace;
	}

  getIsArmored(character: Character): boolean {
    let eq = character.equipment;
    //if (!eq.gear) return "";
    let isArmored = eq.some((item) => {
      if (item.status !== GEAR_STATUS.InUse) return false;
      if ((<Armor>item).armorClass) return true;
      if ((<Armor>item).armorClass === 0 ) return true;
      if ((<Armor>item).armorClassMod) return true;
      return false
    })
    return isArmored;
  }

	getRace(raceName: string): any {
		return this.ds.getRace(raceName);
	}

	getRaces(): any[] {
		return this.ds.getRaces();
	}

	getRawArmorClass(character: Character): number {
		let ac = this.ds.getBaseArmorClass();
		let mod = this.getArmorClassAbilityMod(character);
		return ac + mod;
	}


	getSavingThrowDetailObject(savingThrowName: string, level: number, className?: string,
    raceName?: string, attributes?: Attribute[]): SavingThrowDetail {
    let stdObj = new SavingThrowDetail();
    stdObj.savingThrowName = savingThrowName;
    stdObj.rollTarget = this.ds.getSavingThrow(savingThrowName, className, level);
    stdObj.raceMod = this.ds.getSavingThrowRaceMod(savingThrowName, raceName);
    stdObj.attributeMod = this.ds.getSavingThrowAttributeMod(savingThrowName, attributes);
    stdObj.classMod = this.ds.getSavingThrowClassMod(savingThrowName, className);
    return stdObj;
  }

  getSavingThrowList( level: number = 1, raceName: string = 'Human',
    className: string = "Fighter", attributes?: Attribute[]): any[] {
    raceName = raceName || "Human";
    className = className || "Fighter";
    let savingThrowList: SavingThrowDetail[] = [];
    let savingThrowNames = this.ds.getSavingThrowNames();

    for (let i = 0; i < savingThrowNames.length; i++) {
    let name = savingThrowNames[i];
    let stdObj = this.getSavingThrowDetailObject(name, level, className, raceName, attributes);
    savingThrowList.push(stdObj);
    }

    return savingThrowList;
  }

  getSpells(className?:string, level?: number): any[] {
    return this.ds.getSpells(className, level);
  }

  // getTableAttack(character: Character): any {
	// 	let acZeroHit = this.ds.getAcZeroHit(character.className, character.level || 1);
	// 	let table = new Table('Attack Table','d20 value needed to hit against AC...','Lvl')

	// 	// standard to work from AC -6 to AC 10
	// 	let row = table.addValueRow(character.level || 1);
	// 	for (let i = -6; i < 10; i++) {
	// 		let hit = acZeroHit - i;
	// 		hit = hit > 20 ? 20 : hit < 2 ? 2 : hit;
	// 		table.addHeader(i);
	// 		row.addValue(hit);
	// 	}

	// 	return table;
	// }

	// getTableTurnUndead(character:Character): any {
	// 	let tableValues;
	// 	// Clerics get turnUndead Tabel
	// 	tableValues = this.ds.getTable('turnUndead',character);
	// 	if (!tableValues) return null;

	// 	let table = new Table('Turn Undead', '2d6 value needed to turn undead of HD...', 'Level', 'Monster HD');
	// 	table.headers = Object.keys(tableValues);
	// 	let row = table.addValueRow(character.level || 1);
	// 	row.values = Object.keys(tableValues).map((key) => {return tableValues[key]})

	// 	return table;
	// }

	// getTableThiefSkills(character:Character): any {

	// 	let tableValues = this.ds.getTable('thiefSkills',character);
	// 	if (!tableValues) return null;
	// 	let skillMods = this.getThiefSkillMods(character);
	// 	let values = this.ds.addObjectsAndValues(tableValues,skillMods);
	// 	let table = new Table('Thief Skills (modified)','% chance thief will be able to...',
	// 												'Lvl','Skill');
	// 	table.headers = Object.keys(values)
	// 									.map((key) => {return new CaseConvertPipe().transform(key,'FC')});
	// 	let row = table.addValueRow(character.level || 1);
	// 	row.values = Object.keys(values)
	// 								.map((key) => {return Math.round(values[key] * 100) + '%'})
	// 	return table;

	// }

	// getTableSpellProgression(character: Character) {
	// 	let tableValues = this.ds.getTable('spellProgression',character);
	// 	if (!tableValues) return null;
	// 		// Characters can have mutiple spell progressions (e.g. rangers
	// 		// get Druid and Magic-User spells as certain levels).  This
	// 		// table is arranged {SpellType: {Level: {SpellLevel: number...}}}
	// 		// we will return this as multiple tables, one for each spell type.
	// 		// so first we break it out into spell type tables.
	// 	let table = new Table('Spell Progression','# of memorized spells of level...','Type','Spell Level')

	// 	let rowNames = Object.keys(tableValues);
	// 	let headers = []

	// 	rowNames.forEach( rowName => {
	// 		let classTable = tableValues[rowName];
	// 		let levelTable = classTable[character.level || 1];
	// 		headers = headers.concat(Object.keys(levelTable));
	// 	});
	// 	let headerSet = new Set(headers);
	// 	headers = Array.from(headerSet);
	// 	headers.sort();
	// 	table.headers = headers;

	// 	rowNames.forEach((rowName) => {
	// 		let row = table.addValueRow(rowName);
	// 		let classTable = tableValues[rowName];
	// 		let levelTable = classTable[character.level || 1];
	// 		// supplement with additional spells for Clerics and Druids
	// 		if (rowName == 'Cleric' || rowName == 'Druid') {
	// 			levelTable = this.addAdditionalSpells(levelTable, character);
	// 		}

	// 		row.values = headers.map((key) => {return levelTable[key] || 0;});

	// 	});
	// 	return table
	// }

	// getTableSavingThrow(character: Character): any {
	// 	let raceName = character.raceName || "Human";
	// 	let className = character.className || "Fighter";
	// 	let table = new Table('Saving Throws','d20 value needed to save against...',"Lvl")
	// 	let savingThrowNames = this.ds.getSavingThrowNames();
	// 	let row = table.addValueRow(character.level || 1,'text-center');

	// 	for (let i = 0; i < savingThrowNames.length; i++) {
	// 		let stdObj = this.getSavingThrowDetailObject(savingThrowNames[i], character.level || 1,
	// 																									className, raceName, character.attributes);
	// 		let rollNeeded = stdObj.rollTarget - stdObj.raceMod - stdObj.classMod - stdObj.attributeMod;

	// 		table.addHeader(new CaseConvertPipe().transform(savingThrowNames[i],'FC'));
	// 		row.addValue(rollNeeded);

	// 	}

	// 	return table;
	// }

	// getTablesRelevant(character: Character): any[] {
	// 	let tables = [];
	// 	// Tables are for the specific character level.  They will
	// 	// be an object with name, description, and a vlaues object where properties will
	// 	// be the header and values will be the table values

	// 	// everyone gets an attack table
	// 	tables.push(this.ts.getAttackTable(character));

	// 	let turnUndead = this.ts.getTurnUndeadTable(character);
	// 	if (turnUndead) tables.push(turnUndead)

	// 	// Thieves get theifAbility tabler
	// 	let thiefSkills = this.ts.getThiefSkillsTable(character);
	// 	if (thiefSkills) tables.push(thiefSkills);

	// 	// Everyone gets saving throws
	// 	let savingThrows = this.ts.getSavingThrowTable(character);
	// 	tables.push(savingThrows);

	// 	// magic folks get spell-count table
	// 	let spellProgression = this.ts.getSpellProgressionTable(character);
	// 	if (spellProgression) tables.push(spellProgression)

	// 	return tables;
	// }

	getThiefSkillList(): string[] {
		let cClass = this.ds.getClass('Thief');
		let skills = cClass['thiefSkills'][1]; // there MUST be a skill list for level 1 thief
		return Object.keys(skills);
	}

	getThiefSkillMods(character: Character): any {
		// Get Dexterity Modification
		let attributes = this.getAdjustedAttributes(character.attributes,
																			character.raceName, character.className)
		let attribute: Attribute = this.getAttributeByAttributeKey('DEX',attributes);
		let abilityMod = this.getAbilityModByAbility('thiefSkill','DEX',attribute.value);
		// Thief Skill Dex mod is a bare number applied to all thiefSkills, so create
		// a thiefSkill Object with all the skills set to the mod value
		let skills = this.getThiefSkillList();
		let abilityModObject = skills.reduce(
				(skillObj,skill)=> {
							skillObj[skill] = abilityMod.value;
							return skillObj;
				}, {});
		// get race mod
		let race = this.getRace(character.raceName) || {};
		let raceSkillMods = race.thiefSkillMods || {};
		//TODO: What if racethiefskills aren't found?
		let skillMods = this.ds.addObjectsAndValues(abilityModObject,raceSkillMods);
		return skillMods;
	}

	getValidity(attributes?: Attribute[], className?: string, raceName?: string): any {
		let charClass = className ?	this.ds.getClass(className) : null;
		if (!charClass && className) throw `Invalid class name (${className})`

		let race = raceName ? this.ds.getRace(raceName) : null;
		if (!race && raceName) throw `Invalid race name (${raceName})`;

		//let adjustedAttributes: any[] = [];

		//if (attributes) adjustedAttributes = (!raceName) ? attributes : this.getAdjustedAttributes(attributes, raceName);
		let adjustedAttributes = attributes;

		let validity = {
			race: race,
			charClass: charClass,
			adjustedAttributes: adjustedAttributes,
			meetsRaceRequirements: true,
			meetsClassRequirements: true,
			xpAdjustment: 0
		}

		if (raceName) {
			validity.meetsRaceRequirements =  this.meetsRaceRequirements(adjustedAttributes, raceName, className);
		};

		if (className) {
			validity.meetsClassRequirements = this.meetsClassRequirements(adjustedAttributes, className),
			validity.xpAdjustment = this.getXpAdjustment(adjustedAttributes, className)
		}
		return validity;
	}

	getValueInUnits(targetUnit, amount, sourceUnit) {
		let target = this.ds.getCurrency(targetUnit);
		let source = this.ds.getCurrency(sourceUnit);
		if (!target || !source) throw `dataservice: cannot convert ${sourceUnit} to ${targetUnit}`

		amount = source.value * amount / target.value;
		return amount;
	}

	getXpAdjustment(attributes: Attribute[], className: string): number {
		let characterClass: any = this.ds.getClass(className);
		if (!characterClass) throw 	`Invalid class name ${className}`;
		let requisites = characterClass.primeRequisites;
		if (requisites.length<1) return 0;

		let requisiteTotal = 0, requisiteCount = 0;
		for (let i = 0; i < attributes.length; i++) {
			let key = attributes[i].key;
			let value = attributes[i].value;
			for (let j = 0; j < requisites; j++) {
				if (requisites[j]==key) {
					requisiteTotal += value;
					requisiteCount += 1;
				}
			}
		}
		let avg = Math.ceil(requisiteTotal/requisiteCount);
		let xpAdjustment = this.ds.XpAdjustments[avg];
		return xpAdjustment;
	}

	meetsClassRequirements(attributes?: Attribute[], className?: string): boolean {
		let characterClass: any = this.ds.getClass(className);
		if (className && !characterClass) throw 	`Invalid class name (${className})`;
		if (!characterClass) return true;
		let requirements = characterClass.attributeRequirements;
		attributes = attributes || [];

		let hasRequirements = true;
		for (let i = 0; i < attributes.length; i++) {
			let key = attributes[i].key;
			let value = attributes[i].value;
			if (requirements[key] && value < requirements[key]) {
				hasRequirements = false;
				break;
			}
		}
		return hasRequirements;
	}

  /**
   * Is the specified race valid given the specified attributes and class
   * @param  {Attribute[]} attributes (optional) Race-Adjusted attributes
   * @param  {string}      raceName   (optional) Name of race to validate
   * @param  {string}      className  (optional) Name of class to validate race against
   * @return {boolean}                Given the inputs, this is valid or not vlaid
   */
	meetsRaceRequirements(attributes?: Attribute[], raceName?: string, className?: string): boolean {
		let race = raceName ? this.ds.getRace(raceName) : null;
		if (!race && raceName) throw `Invalid race name (${raceName})`;
		if (!race) return true;
		let charClass: any = this.ds.getClass(className);
		if (className && ! charClass)  throw `Invalid class name (${className})`;
		let requirements = race.attributeEffects;
		attributes = attributes || [];

		let hasRequirements = true;
		for (let i = 0; i < attributes.length; i++) {
			let key = attributes[i].key;
			let value = attributes[i].value;
			let requirement = requirements[key];
			// Get rid of max requirements.  Can be handled in the future by
			// deducting to max, if wanted
			// || value > requirement.maxValue
			if (requirement &&
				(value < requirement.minValue  ||
				(requirement.required && requirement.required > value))
			) {
				return false;
			}
		}

		// race affects attributes, so this race is not available if the class
		// is specified and this race adjusts the attributes so they don't match the
		// class
		if (className) {
			return this.meetsClassRequirements(attributes, className);
		}
		return true;
	}

	ordinalize(input: number): string {
		let ordinalizers: string[] = ['th','st','nd','rd','th','th','th','th','th','th'];
		let num = input % 100;
		if (num < 20 && num > 9) return input + 'th';
		num = num % 10;
		return input + ordinalizers[num];
	}

	roll(rollNotation: string): number {
		return Roll.roll(rollNotation);
	}

	stringifyArrayOrdinally(a: string[], separator: string = ';'): string {
		let returnString = '';
		for (let i = 0; i < a.length; i++) {
			let ordinal = this.ordinalize(i+1);
			returnString += (i==0 ? '' : '; ') + ordinal + ': ' + a[i];
		}
		return returnString;
	}
}
