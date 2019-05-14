import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Character, Attribute, STAGE, Gear } from '../character.class';
import { CharacterService } from '../character.service';
import { DataService } from '../data.service';
import { TableService } from '../shared/table.service';
import * as _ from 'lodash';

@Component({
	selector: 'character-creation',
  templateUrl: './character-creation.component.html',
	styleUrls: ['./character-creation.component.css','../app.component.css'],
	providers: [CharacterService, DataService],
})


export class CharacterCreationComponent implements OnInit {

  /**
   * Character being created/edited
   * @type {Character}
   * @memberOf CharacterCreationComponent
   */
  character: Character;
  /**
   * Key for the character being created/edited
   * @type {string}
   * @memberOf CharacterCreationComponent
   */
	characterKey: string;
	userId: string;
	gameKey: string;

	status: any = this.ds.userData.status;

	rollCount: number = 0;
	allowedRolls: number = 3;

	STAGE = STAGE;
	JSON = JSON;
  isNaN = isNaN;

  infoRace: string;
  infoClass: string;

	constructor(public cs: CharacterService, private ds: DataService,
              private router: Router, private route: ActivatedRoute,
              private ts: TableService) {
	}

	ngOnInit() {
    // Retrieve state from the parameterrs in the URL
		this.route.paramMap.subscribe( params => {
			this.characterKey = params.get('key');
			this.userId = params.get('userId');
			this.gameKey = params.get('gameKey');
			if (this.characterKey == 'new') {
				this.character = new Character();
				this.character.userId = this.userId;
				this.characterKey = null;
			} else {
				// Have to subscribe rather than using async because otherwise cannot
				// access the character in the drag and drop functionality (async as
				// works in a separate scope)
				this.ds.fetchCharacter$(this.characterKey).take(1)
							.subscribe(c=>this.character = c);
			}
		})
	}

	ngOnDestroy() {
		//this.subscription.unsubscribe();
	}

  /**
   * Save current progress to DB
   *
   * @param {any} character Caracter to be saved
   *
   * @memberOf CharacterCreationComponent
   */
  saveProgress(character) {
    // No global key assigned means this is a new character
		if (!this.characterKey) {
			this.characterKey = this.ds.saveCharacter(character);
			character.key = this.characterKey;
		}	else {
			this.ds.updateCharacter(character);
		}
	}

  /**
   * Toggle Character Creation stage depending on lock/unlock.
   *
   * @param {Character} character Character for which to toggle stage
   * @returns {void}
   *
   * @memberOf CharacterCreationComponent
   */
  toggleEquipmentStage(character: Character) {
    // Can only change stage if currently in the equipment stage
		if (character.stage > STAGE.Spells ||
				character.stage < STAGE.Details) return;

		if (character.stage == STAGE.Equipment) {
      // HACKY: spell progression tables will be null if there are no
      // current spells for this character.  If no Speels, then creation
      // is complete
			character.stage = this.ts.getSpellProgressionTable(character, this.cs) ? STAGE.Spells : STAGE.Complete;
		} else {
			character.stage = STAGE.Equipment;
    }
    // Save the current stage
		this.saveProgress(character);
  }

  /**
   * helper function for determining if an object is in an array
   *
   * @param {any[]} a Array to look in
   * @param {*} lookup Object to lookup
   * @returns {boolean} true if found
   *
   * @memberOf CharacterCreationComponent
   */
	isIn(a: any[], lookup: any): boolean {
		if (!a || !a.length) return true;
    return a.some(item => lookup==item);
	}
}
