export class Game {
	key: string;
	dmUserId: string;
	gameStatus;//: STAT = STAT.Created;
	characters: string[];
	startDate: Date;
	name: string;
	description: string;
	options: GameOptions = new GameOptions();
	notes;
	turnsPassed: string;
	dungeon: string;	
	isLocked: boolean;
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

export class GameNote {
	date: Date;
	note: string;
}
