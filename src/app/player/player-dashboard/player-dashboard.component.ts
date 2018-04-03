import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { CharacterService } from '../../character.service';
import { DataService } from '../../data.service';

import { Character, STAGE, GAME_STATUS } from '../../character.class';
import { Game } from '../../game.class';

@Component({
  selector: 'app-player-dashboard',
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css','../../app-styles.css'],
	providers: [ CharacterService, DataService ]
})
export class PlayerDashboardComponent implements OnInit {
	
	characters$: Observable<Character[]>;
	games$: Observable<Game[]>;
	invites$: Observable<any[]>;
	
	STAGE = STAGE;
	GAME_STATUS = GAME_STATUS;
	
	games: any = {};
	
	userId

  constructor(private cs: CharacterService, private ds: DataService,
							private router: Router) { }

  ngOnInit() {
		this.userId = this.ds.user.uid
		this.characters$ = this.ds.fetchCharactersByUserId$(this.userId);
		this.games$ = this.ds.fetchGames$();
		this.games$.subscribe( games => {
			games.forEach( game => {
				this.games[game.key] = game;
			});
		});
				
		
  }
	
	filterEngagedCharacters(characters: Character[]): Character[] {
		return characters.filter( character => (character.currentGame ? true : false) )
	}
	
	filterUnfinishedCharacters(characters: Character[]): Character[] {
		return characters.filter( character => {
			if (character.currentGame) return false;
			if (character.stage < STAGE.Complete) return true;
			return false;
		});
	}
	filterIdleCharacters(characters: Character[]): Character[] {
		return characters.filter( character => {
			if (character.currentGame) return false;
			return true;
		});
	}
	
	getAttributeValue(attributeKey,attributes): number {
		if (!attributes) return 0;
		return attributes.find(attribute=> { return attribute.key == attributeKey }).value;
	}
	
	leaveGame(character: Character) {
		this.ds.leaveGame(character, this.games[character.currentGame]);
	}
	
	playGame(character: Character) {
		this.router.navigate(['/play-game',character.currentGame,'character',character.key]);
	}
	
	newCharacter() {
		this.router.navigate(['/character-creation','new','user',this.userId]);
	}
	
	continueCharacterCreation(character) {
		this.router.navigate(['/character-creation',character.key,'user',character.userId]);
	}
}
