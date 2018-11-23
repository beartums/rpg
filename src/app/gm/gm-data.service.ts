// import { Character } from './../character.class';
//import { Monster } from './../game.class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { from } from 'rxjs/observable/from';
//import { forkJoin } from 'rxjs/observable/forkJoin';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/forkJoin';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/toArray';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

import * as _ from 'lodash';

import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';

import { ATTRIBUTES, RACES, CLASSES, XP_ADJUSTMENTS, SPELLS, CLASS_GROUP_XREF,
				SAVING_THROW_NAMES, SAVING_THROWS, ATTRIBUTE_ABILITY_MODIFIERS_XREF,
				ATTRIBUTE_ABILITY_MODIFIERS, LANGUAGE_PROFICIENCY, ATTACK_TABLES,
				CURRENCY_VALUES } from  '../data/constants';

import { MONSTERS } from '../data/monsters';
import { Game, GameOptions } from '../game.class';
import { Monster } from '../monster.class';
import { Roll } from '../shared/roll';
import { Character, Attribute, SavingThrowDetail } from '../character.class';
import { User } from 'firebase';
import { FirebaseDatabase } from '@firebase/database-types';

interface CharacterAndUser {
  character: Character,
  user: User
}
@Injectable()
export class GmDataService {

	uid$: BehaviorSubject<string|null>;

	monsters$;
	monsters;
	monstersRef;

	gamesRef;
	games$;

	usersRef;
	users$;

	charactersRef;

  constructor(private authService: AuthService, private db: AngularFireDatabase) {
		this.usersRef = db.list('/Users');
		this.gamesRef = db.list('/Games');
		this.monstersRef = db.list('/Reference/Monsters');
		this.charactersRef = db.list('/Characters');
		//this.usersRef.subscribe
		this.games$ = this.gamesRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
		this.monsters$ = this.monstersRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
		this.monsters$.subscribe( monsters => this.monsters = monsters );

		this.users$ = this.usersRef.snapshotChanges().map(changes => {
      return changes.map(c => {
				let usr = { key: c.payload.key, ...c.payload.val() };
				return usr;
			});
		});
	}

	onDestroy() {
		//this.games$.unsubscribe();
	}

  addCharacter(character: Character): Character {
		let whatisit = this.charactersRef.push(character);
		return whatisit;
	}

	addGame(game: Game): Game {
		game.dmUserId = this.authService.userId;
		let gameRef = this.gamesRef.push(game);
		return game;
	}

	addMonster(monster) {
		this.monstersRef.push(monster);
	}

  deleteCharacter(key:string) {
		this.charactersRef.remove(key)
	}

	deleteGame(key: string): FirebaseDatabase {
		let gameRef = this.gamesRef.remove(key);
		return gameRef;
	}

  deleteMonster(key?) {
		this.monstersRef.remove(key);
  }

  /**
   * Fetch the characters in the game (and their players)
   *
   * @param {Game} game Game for which to fetch characters
   * @returns Oservable array of CharactersAndUsers
   *
   * @memberOf GmDataService
   */
  fetchCharactersAndPlayers$(game: Game): Observable<CharacterAndUser[]> {
		let characterIds = game.characters;
		if (characterIds.length>0) {
			// convert array into a stream of observables
			return from(characterIds)
			// Get a single character
				.mergeMap(characterId => this.fetchCharacter$(characterId).take(1))
				.mergeMap((character: Character) => {
			// Get the character's user
					return this.fetchUser$(character.userId).take(1)
					// return an object with the character and user
						.map(user => {return {character: character, user: user}} )
				})
				// make it a single array for display using async pipe
				.toArray();
		}
	}

	fetchCharacter$(id): Observable<Character> {
		return this.getTransformedSnapshotChanges(this.getCharacterRef(id))
	}

	fetchCharactersByGameId$(key: string): Observable<Character[]> {
		let characters = this.db.list('/Characters',ref=>ref.orderByChild('currentGame').equalTo(key));
		return characters.snapshotChanges().map(changes => {
			return changes.map( c=> ({ key: c.payload.key, ...c.payload.val() }) );
		});
	}

  fetchGame$(key:string): Observable<Game> {
		return <Observable<Game>>this.db.object('Games/' + key).valueChanges();
	}

	fetchPlayers$(): Observable<User[]> {
		return this.db.list('/Users').snapshotChanges().map(changes => {
			return changes.map( c=> ({ key: c.payload.key, ...c.payload.val() }) );
		});
	}

	fetchUser$(id): Observable<User> {
		let a$ = this.db.object('/Users/' + id);
		return this.getTransformedSnapshotChanges(a$);
	}

  getAllCharacters$(): Observable<Character[]> {
		return this.charactersRef.snapshotChanges().map(changes => {
			return changes.map( c=> ({ key: c.payload.key, ...c.payload.val() }) );
		});
	}

	getCharacterRef(id) {
		return this.db.object('/Characters/' + id);
	}

	getFileMonsters() {
		return MONSTERS;
	}

	getTransformedSnapshotChanges(object$) {
		let snapshot = object$.snapshotChanges();
		let transformed = snapshot.map(changes => {
			return ({ key: changes.key, ...changes.payload.val() });
		});
		return transformed;
	}

	generateXp(monster: Monster): number {
		let xp = 0;
		if (monster.xp) return xp;
		return xp;
	}

  /**
   * Update the character in the online database
   *
   * @param {string} key Character key string
   * @param {Partial<Character>} character Object with 0 or more properties
   *  from the Character Class
   *
   * @memberOf GmDataService
   */
  updateCharacter(key: string, character: Partial<Character>) {
		let uChar = _.cloneDeep(character);
		delete uChar.key;
		this.charactersRef.update(key,uChar);
	}

	updateGame(key: string,game: Game) {
		let uGame = _.cloneDeep(game)
		delete uGame.key;
		let gameRef = this.gamesRef.update(key,uGame)
	}

	updateMonster(key: string, monster: Monster) {
		let uMon = _.cloneDeep(monster);
		delete uMon.key;
		this.monstersRef.update(key,uMon);
  }

}
