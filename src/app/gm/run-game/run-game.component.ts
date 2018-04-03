import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { GmDataService } from '../gm-data.service';
import { CharacterService } from '../../character.service';

import { Game, GameOptions } from '../../game.class';
import { Character, STAGE, GAME_STATUS } from '../../character.class';

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.css'],
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
	
	getAttributeValue(attributeKey,attributes): number {
		if (!attributes) return 0;
		return attributes.find(attribute=> { return attribute.key == attributeKey }).value;
	}
		
	findExistingCharacter() {
		this.selectedCharacter = null;
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
	
	newCharacter() {
		this.selectedCharacter = null;
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
			this.selectedCharacter = null;
		}
	}
	ejectCharacter(character) {

			let idx = this.game.characters.indexOf(character.key);
			this.game.characters.splice(idx,1);
			this.gmds.updateGame(this.key,this.game);
			character.currentGame = null;
			this.gmds.updateCharacter(character.key,character);
			this.selectedCharacter = null;
	}
	
	getStatuses() {
		let statuses = []
		let idx = 0;
		while (GAME_STATUS[idx]) {
			statuses.push(GAME_STATUS[idx++])
		}
		return statuses;
	}	
	
	changeGameStatus(game) {
		this.gmds.updateGame(this.key,game);
	}
			
	select(character) {
		if (this.selectedCharacter == character) this.selectedCharacter = null;
		else this.selectedCharacter = character;
	}
	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription=> { subscription.unsubscribe() });
  }

}
