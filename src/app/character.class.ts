//import { Equipment } from './character.class';
//import { Roll } from '.\roll';
import { Note } from './game.class';

export enum AlignmentLaw {
	"Lawful", "Neutral", "Good"
}
export enum GAME_STATUS { New, Playing, Paused, Cancelled, Completed }

export enum STAGE { Attributes, Details, Equipment, Spells, Complete }

export enum GEAR_STATUS { InUse, Stowed, Stored }

export enum GENDER { 'Male', 'Female', "It's Complicated" }

export class Character {
	key: string;
	name: string;
	nickname: string;
	level: number = 0;
	gender: string;
	className: string;
	raceName: string;
	hitPoints: number = 0;
	temporaryHitPoints?: number;
	experiencePoints: number = 0;
	alignmentLaw: string;
	alignmentGood: string;
	attributes: Attribute[];
	equipment: Array<Gear|Weapon|Armor>;
  //treasure: Treasure[];
	gold: number = 0;
	stage: STAGE = STAGE.Attributes;
	attributeRolls?: number = 0;
	xpRolls?: number = 0;
	currentGame?: string;
	userId: string;
	retainedBy: string;
	notes: Note[];
}

export class Attribute {
	constructor(public key: string, public value: number) {}
}


export class Equipment {
	gear: Array<Gear> = [];
	//weapons: Weapon[];
	//armor: Armor[];
	//inUse: any[];
}

export class Gear {
	name: string;
	cost: number;
	denomination: string;
	pounds: number;
	type: string;
	notes: string;
	count?: number;
	qty: string;
	selectedCount: number;
	status: GEAR_STATUS = GEAR_STATUS.InUse;
}

export class Weapon extends Gear {
	oneHandDamage: string;					 // roll notation
	twoHandDamage: string;
}
export class Armor extends Gear {
	armorClass: number;
	armorClassMod?: number;
}

export class SavingThrowDetail {
	savingThrowName: string;
	rollTarget: number;
	raceMod: number;
	classMod: number;
	attributeMod: number;
}
