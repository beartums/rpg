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
import { Game, GameOptions } from '../game.class';
import { Roll } from '../shared/roll';
import { Character, Attribute, SavingThrowDetail } from '../character.class';

@Injectable()
export class GmDataService {
	
	uid$: BehaviorSubject<string|null>;
	games$;
	users$;
	gamesRef;
	usersRef;
	charactersRef;

  constructor(private authService: AuthService, private db: AngularFireDatabase) {
		this.usersRef = db.list('/Users');
		this.gamesRef = db.list('/Games');
		this.charactersRef = db.list('/Characters');
		//this.usersRef.subscribe
		this.games$ = this.gamesRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
		this.users$ = this.usersRef.snapshotChanges().map(changes => {
      return changes.map(c => {
				let usr = { key: c.payload.key, ...c.payload.val() };
				usr.characters = ['pepe','papa'];
				return usr;
			});
		});
		//let usersSubscription = this.users$.subscribe(users => {
		//	this.moveCharacters(users, usersSubscription);
		//});
		/**
		this.uid$ = new BehaviorSubject(authService.userId)
		this.games$ = this.uid$.switchMap(uid =>
					db.list('/Games', ref => ref.equalTo(uid)).valueChanges()
		)
		*/
	}
	
	getCharacters(userList, subscription) {
		userList.forEach(user => {
			user.Character.userId = user.key;
			let characterRef = this.charactersRef.push(user.Character);
			user.characterIds = [];
			user.characterIds.push(characterRef.key);
			this.usersRef.update(user.key,{key: null, characterIds: user.characterIds});
		});
		subscription.unsubscribe();
	}
	
	addGame(game: Game): Game {
		game.dmUserId = this.authService.userId;
		let gameRef = this.gamesRef.push(game);
		return game;
	}
	
	fetchCharactersAndPlayers(game) {
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
	
	getAllCharacters$() {
		return this.charactersRef.snapshotChanges().map(changes => {
			return changes.map( c=> ({ key: c.payload.key, ...c.payload.val() }) );
		});
	}
	
	getCharacterRef(id) {
		return this.db.object('/Characters/' + id);
	}
	fetchCharacter$(id) {
		return this.getTransformedSnapshotChanges(this.getCharacterRef(id))
	}
	
	fetchCharactersByGameId$(key: string): Observable<Character[]> {
		let characters = this.db.list('/Characters',ref=>ref.orderByChild('currentGame').equalTo(key));
		return characters.snapshotChanges().map(changes => {
			return changes.map( c=> ({ key: c.payload.key, ...c.payload.val() }) );
		});
	}
	
	fetchUser$(id) {
		let a$ = this.db.object('/Users/' + id);
		return this.getTransformedSnapshotChanges(a$);
	}
	
	removeGame(key) {
		let gameRef = this.gamesRef.remove(key);
		return gameRef;
	}
	
	getTransformedSnapshotChanges(object$) {
		let snapshot = object$.snapshotChanges();
		let transformed = snapshot.map(changes => {
			return ({ key: changes.key, ...changes.payload.val() });
		});
		return transformed;
	}
	
	updateGame(key: string,game: Game) {
		let uGame = _.cloneDeep(game)
		delete uGame.key;
		let gameRef = this.gamesRef.update(key,uGame)
	}

	fetchGame$(key:string): Observable<Game> {
		return <Observable<Game>>this.db.object('Games/' + key).valueChanges();
	}
	
	fetchPlayers$() {
		return this.db.list('/Users').snapshotChanges().map(changes => {
			return changes.map( c=> ({ key: c.payload.key, ...c.payload.val() }) );
		});
	}
	
	saveCharacter(character) {
		let whatisit = this.charactersRef.push(character);
		return whatisit;
	}
	
	updateCharacter(key: string,character) {
		let uChar = _.cloneDeep(character);
		delete uChar.key;
		this.charactersRef.update(key,uChar);
	}
	deleteCharacter(key:string) {
		this.charactersRef.remove(key)
	}
		
	onDestroy() {
		//this.games$.unsubscribe();
	}
}
