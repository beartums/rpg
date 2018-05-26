import { GmDataService } from './gm/gm-data.service';

export class Monster {
	key?: string;
		name: string;
		edition: Edition;
		encNum: string | number;
		lairNum: string | number;
		alignment: string; //C (evil),
		movement: string | number;
		encMovement: string | number;
		ac: string | number;
		hd: string | number;
		attacks: string | number;
		attackTypes: string;
		specialAttacks: string | number;
		damage: string;
		savingThrow: string;
		morale: string | number;
		hoardClass: string;
		type: string;
		xp: number;
		additionalCharacteristics: any;
		description: string;
	}
	
	export class Encounter {
		date: Date;
		gameId: string;
		gameTurn: number;
		notes: string;
		encounteredMonsters: MonsterInstance[];
		recoveredBooty: Booty[];
	}
	
	export class MonsterInstance extends Monster {
		hitPoints: number;
		tempHitPoints: number = null;
		booty: Booty[] = [];
		experiencePoints: number;
		encounterResult: EncounterResult = EncounterResult.Undetermined;
		isDead: boolean = false;
		
		constructor(monster: Monster) {
			super();
			if (!monster) return;
			
			/**if (monster.xp) {
				this.experiencePoints = monster.xp;
			} else {
				this.experiencePoints = GmDataService.generateXp(monster);
			}**/
		}	
	}
	
	export enum EncounterResult { 
		Undetermined, Killed, Subdued, ScaredAway, Outwitted, Escaped
	}
	
	export enum Edition {
		AE, B
	}
	
	export class Booty {
		gpValue: number;
		lbsWeight: number;
		quantity: number;
		type: BootyType;
		notes: string;
		description: string;
	}
	
	export enum BootyType {
		CopperPieces, SilverPieces, ElectrumPieces, GoldPieces, PlatinumPieces, Gems, Jewelry, Other
	}