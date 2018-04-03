import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

import { GmDataService } from '../gm-data.service';

import { CharacterService } from '../../character.service';

import { Game, GameOptions } from '../../game.class';
import { Character } from '../../character.class';

@Component({
  selector: 'edit-character',
  templateUrl: './edit-character.component.html',
  styleUrls: ['./edit-character.component.css'],
	providers: [ CharacterService ]
})
export class EditCharacterComponent implements OnInit {

	@Output() characterChange: EventEmitter<Character> = new EventEmitter<Character>()
	@Input() character: Character;
	_character: Character;
	
	players$;
	alignments;
	
  constructor(private cs: CharacterService, private gmds: GmDataService) { }

  ngOnInit() {
		this.players$ = this.fetchPlayers$();
		this.alignments = this.cs.getAlignments();
  }
	
	ngOnChanges(changes: SimpleChanges) {
		for (let prop in changes) {
			if (prop == 'character') {
				// TODO: warn and save, if needed;
				this._character = _.cloneDeep(this.character);
			}
		}
	}
	
	getClasses() {
		return this.cs.getClasses();
	}
	
	getRaces() {
		return this.cs.getRaces();
	}
	
	isChanged() {
		let isEqual =  _.isEqual(this._character,this.character);
		return isEqual;
	}
	
	fetchPlayers$() {
		let players$ = this.gmds.fetchPlayers$()
		return players$.take(1);
	}

	
	reset() {
		this._character = _.cloneDeep(this.character);
	}
	
	cancel() {
		this.characterChange.emit(null);
	}
	
	save() {
		this.character = _.cloneDeep(this._character)
		delete this._character.key
		this._character.attributes = this._character.attributes.map(a => { 
			a.value = +a.value;
			//console.log(a.value + 1, a.value + '1');
			return a;
		})
		this.gmds.updateCharacter(this.character.key,this._character)
		this.characterChange.emit(null);
	}	

}
