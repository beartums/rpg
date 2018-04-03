//import { Roll } from '.\roll';
export enum AlignmentLaw {
	"Lawful", "Neutral", "Good"
}
export enum GAME_STATUS { New, Playing, Paused, Cancelled, Completed }
 
export enum STAGE { Attributes, Details, Equipment, Spells, Complete }

export class Character {
	key: string;
	name: string;
	nickname: string;
	level: number = 0;
	gender: string;
	className: string;
	raceName: string;
	hitPoints: number = 0;
	experiencePoints: number = 0;
	alignmentLaw: string;
	alignmentGood: string;
	attributes: Attribute[];
	equipment: Equipment = new Equipment();
	treasure: Treasure[];
	gold: number = 0;
	stage: STAGE = STAGE.Attributes;
	attributeRolls?: number = 0;
	xpRolls?: number = 0;
	currentGame: string;
	userId: string;
	retainedBy: string;
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
}

export class Weapon extends Gear {
	oneHandDamage: string;					 // roll notation
	twoHandDamage: string;
}
export class Armor extends Gear {
	armorClass: number;
	armorClassMod?: number;
}

export class Treasure {
	type: string;
	name: string;
	description: string;
	quantity: number;
	value: number; // GP value
}

export class SavingThrowDetail {
	savingThrowName: string;
	rollTarget: number;
	raceMod: number;
	classMod: number;
	attributeMod: number;
}
