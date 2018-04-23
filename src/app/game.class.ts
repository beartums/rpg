export class Game {
	key: string;
	dmUserId: string;
	gameStatus;//: STAT = STAT.Created;
	characters: string[];
	startDate: Date;
	name: string;
	description: string;
	options: GameOptions = new GameOptions();
	turnsPassed: string;
	dungeon: string;	
	isLocked: boolean;
	notes: Note[];
	monstersDefeated: Monster[];
	treasureFound: Treasure[];
}

export class GameOptions {
	attributeRollPattern: string = '5d6k3';
	attributeRollsAllowed: number = 3;
	xpRollsAllowed: number = 3;
	xpRollPattern: string = '3d6';
	xpMultipliers: {percent: number, multiplier: number}[] = [
		{ percent: 10, multiplier: 5 },
		{ percent: 80, multiplier: 10 },
		{ percent: 5, multiplier: 50 },
		{ percent: 5, multiplier: 100 },
	];
	goldRollPattern: string = '3d6';
	goldMultipliers: {percent: number, multiplier: number}[] = [
		{ percent: 10, multiplier: 5 },
		{ percent: 80, multiplier: 10 },
		{ percent: 5, multiplier: 50 },
		{ percent: 5, multiplier: 100 },
	];
	useRaceClassRestrictions: boolean = false;
}

export class Note {
	key: string;
	parentId: string;
	date: Date;
	datetime: Date;
	text: string;
	isVisibleToPlayers: boolean = false;
	isEditableByPlayers: boolean = false;
}

export class Treasure {
	key: string;
	gameId: string;
	playerId: string;
	gpValue: number;
	type: TreasureType;
	quantity: number;
	description: string;
	note: Note;
}

export enum TreasureType {
	Gold, Electrum, Copper, Silver, Platinum, Gem, Jewelry, Weapon, Armor, Wand, Scroll,
}

export class Monster {
	key: string;
	gameId: string;
	hd: number;
	hdMod: number;
	name: string;
	monsterReferenceId: string;
	note: Note;
}
