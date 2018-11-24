import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Character, Attribute, STAGE, Gear } from '../character.class';
import { CharacterService } from '../character.service';
import { DataService } from '../data.service';
import * as _ from 'lodash';

@Component({
	selector: 'character-creation',
  templateUrl: './character-creation.component.html',
	styleUrls: ['./character-creation.component.css','../app.component.css'],
	providers: [CharacterService, DataService],
})


export class CharacterCreationComponent implements OnInit {

	character: Character;
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
							private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {
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
				// works ina separate scope)
				this.ds.fetchCharacter$(this.characterKey).take(1)
							.subscribe(c=>this.character = c);
			}
		})
	}

	ngOnDestroy() {
		//this.subscription.unsubscribe();
	}

	saveProgress(character) {
		if (!this.characterKey) {
			this.characterKey = this.ds.saveCharacter(character);
			character.key = this.characterKey;
		}	else {
			this.ds.updateCharacter(character);
		}
	}

	toggleEquipmentStage(character: Character) {
		if (character.stage > STAGE.Spells ||
				character.stage < STAGE.Details) return;

		if (character.stage == STAGE.Equipment) {
			// HACKY: spell progression tables will be null if there are no current spells
			// for this character
			character.stage = this.cs.getSpellProgressionTable(character) ? STAGE.Spells : STAGE.Complete;
		} else {
			character.stage = STAGE.Equipment;
		}
		this.saveProgress(character);
	}

	isIn(a: any[], lookup: any): boolean {
		if (!a || !a.length) return true;
		for (let i = 0; i < a.length; i++) {
			if (a[i]==lookup) return true
		}
		return false;
	}
}
