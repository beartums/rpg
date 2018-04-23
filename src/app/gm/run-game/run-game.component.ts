import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { GmDataService } from '../gm-data.service';
import { CharacterService } from '../../character.service';

import { Game, GameOptions, Note } from '../../game.class';
import { Character, STAGE, GAME_STATUS } from '../../character.class';

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.css','../../app-styles.css'],
	providers: [CharacterService]
})
export class RunGameComponent implements OnInit {

 	game$: Observable<Game>;
	game: Game;
	characters$: Observable<Character[]>;
	players: Observable<any>[] = [];
	subscriptions: any[] = [];
	
	existingCharacters$;
	existingCharacterId;
	addingExistingCharacter: boolean;
	
	key: string;
	selectedCharacter;
	selectedCharacterKey;
	timeoutId;
	
	showArmoredAc: boolean = false;
	
	GAME_STATUS = GAME_STATUS
	
  constructor(private route: ActivatedRoute,
							private gmds: GmDataService, 
							private cs: CharacterService,
							private router: Router ) { }

  ngOnInit() {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.key = params.get('key');
			this.game$ = this.gmds.fetchGame$(this.key);
			this.characters$ = this.gmds.fetchCharactersByGameId$(this.key);
			let subscription = this.game$.subscribe((game: Game) => {
				this.game = game;
			});
			this.subscriptions.push(subscription);
		});
	}
	
	@HostListener('window:keydown', ['$event'])
		keyboardInput(event: any) {
			if (!this.selectedCharacter) return;

			if (event.key!="ArrowDown" && event.key!="ArrowUp") return;
			// HACK: Debounce
			if (this.timeoutId) clearTimeout(this.timeoutId);
			
			if (event.key=="ArrowDown") {
				this.adjustHitPoints(this.selectedCharacter,-1);
			} else if (event.key=="ArrowUp") {
				this.adjustHitPoints(this.selectedCharacter,1);
			}
			return;
		}
	
	adjustHitPoints(character: Character, adjustment: number) {
		let thp = character.temporaryHitPoints;
		if (adjustment==0) return;
	
		if (adjustment < 0) {
			if (!thp && thp!==0) {
				character.temporaryHitPoints = +character.hitPoints;
			}
		// add hit points
		} else if (adjustment > 0) {
			if (!thp && thp !== 0) return;
		}
		
		character.temporaryHitPoints += adjustment;
		if (character.temporaryHitPoints >= character.hitPoints) {
			character.temporaryHitPoints = null;
		}
					
		this.timeoutId = setTimeout( (_this, _key, _character) => {
			_this.gmds.updateCharacter(_key,_character);
		}, 500, this, character.key, character);
		
	}
		
	findExistingCharacter() {
		this.clearSelected();
		this.addingExistingCharacter = true;
		this.existingCharacters$ = this.gmds.fetchCharactersByGameId$(null).take(1);
	}
	
	selectExistingCharacter() {
		let id = this.existingCharacterId;
		if (!this.game.characters) this.game.characters = []
		this.game.characters.push(id);
		this.gmds.updateGame(this.key,this.game);
		this.gmds.updateCharacter(id,{currentGame:this.key});
		this.addingExistingCharacter=false;
		this.existingCharacterId = null;
	}		
	
	updateCharacter(character:Character) {
		this.gmds.updateCharacter(character.key,character);
	}
	
	newCharacter() {
		this.clearSelected();
		let character = new Character();
		character.attributes = this.cs.generateEmptyAttributesArray();
		character.currentGame = this.key;
		character.name = 'Nobody (yet)';
		let charRef = this.gmds.saveCharacter(character);
		if (!this.game.characters) this.game.characters = [];
		this.game.characters.push(charRef.key);
		this.gmds.updateGame(this.key,this.game);
	}
	
	destroyCharacter(character) {
		if (confirm("Do you want to obliterate " + character.name + " PERMANENTLY!?!?")) {
			this.gmds.deleteCharacter(character.key)
			let idx = this.game.characters.indexOf(character.key);
			this.game.characters.splice(idx,1);
			this.gmds.updateGame(this.key,this.game);
			this.clearSelected();
		}
	}
	ejectCharacter(character) {

			let idx = this.game.characters.indexOf(character.key);
			this.game.characters.splice(idx,1);
			this.gmds.updateGame(this.key,this.game);
			character.currentGame = null;
			this.gmds.updateCharacter(character.key,character);
			this.clearSelected();
	}
	
	getStatuses() {
		let statuses = []
		let idx = 0;
		while (GAME_STATUS[idx]) {
			statuses.push(GAME_STATUS[idx++])
		}
		return statuses;
	}	
	
		
	saveNotes(notes: Note[], game: Game) {
		game.notes = notes;
		this.gmds.updateGame(this.key,game);
	}
	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription=> { subscription.unsubscribe() });
  }

/** 
	this section is for the list
	**/
	getAc(character,useArmor) {
		if (!useArmor) return this.cs.getRawArmorClass(character);
		return this.cs.getArmoredArmorClass(character);
	}
	
	toggleAcType() {
		this.showArmoredAc = !this.showArmoredAc;
	}
	
	clearSelected() {
		this.selectedCharacter = null;
		this.selectedCharacterKey = null;
	}
	
	select(character) {
		if (this.selectedCharacterKey == character.key) {
			this.clearSelected();
			return;
		}
		this.selectedCharacterKey = character.key;
		this.selectedCharacter = character;
		// necessary because firebase doesn't save empty properties
		if (!character.equipment) character.equipment = [];
	}
		
	changeGameStatus(game) {
		this.gmds.updateGame(this.key,game);
	}
		
	getAttributeValue(attributeKey,attributes): number {
		if (!attributes) return 0;
		return attributes.find(attribute=> { return attribute.key == attributeKey }).value;
	}
	
	getHP(character:Character): string {
		let hp = "";
		if (character.temporaryHitPoints || character.temporaryHitPoints===0) {
			hp = character.temporaryHitPoints + '/';
		}
		hp += character.hitPoints;
		return hp;
	}
}
