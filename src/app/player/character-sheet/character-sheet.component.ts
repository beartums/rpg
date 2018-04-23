import { Component, OnInit }              from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Character, Attribute, STAGE, Gear, GEAR_STATUS } from '../../character.class';
import { CharacterService } from '../../character.service';
import { DataService } from '../../data.service';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-character-sheet',
  templateUrl: './character-sheet.component.html',
  styleUrls: ['./character-sheet.component.css','../../app-styles.css']
})
export class CharacterSheetComponent implements OnInit {

  character$: Observable<Character>;
	
	characterKey: string;
	gameKey: string;
	
	GEAR_STATUS = GEAR_STATUS
	
	
	constructor(private cs: CharacterService, private ds: DataService,
							private router: Router, private route: ActivatedRoute) {
	}
	
	ngOnInit() {
		this.route.paramMap.subscribe( params => {
			this.characterKey = params.get('key');
			//this.userId = params.get('userId'); 
			this.character$ = this.ds.fetchCharacter$(this.characterKey);
			
			//this.character$.subscribe( character => {this.character = character} )
		})
	}
	
	getArmoredAc(character: Character): number {
		return this.cs.getArmoredArmorClass(character);
	}
	
	getItemProperties(item: any): string {
		let props = [];
		if (item.armorClass) props.push('AC: ' + item.armorClass);
		if (item.oneHandDamage) props.push('1H: ' + item.oneHandDamage);
		if (item.twoHandDamage) props.push('2H: ' + item.twoHandDamage);
		if (item.armorClassMod) props.push('ACMod: ' + item.armorClassMod);
		return props.join('; ');
	}
	
	getWeight(character): number {
		if (!character || ! character.equipment) return 0;
		let gear = character.equipment;
		let weight:number = gear.reduce( (wt: number,item: Gear) => {
					if (item.status != GEAR_STATUS.Stored && item.pounds) {
						wt = +wt + +item.pounds * (+item.count);
					}
					return wt;
		}, 0);
		return weight;
	}

	getValue(character): number {
		if (!character || ! character.equipment) return 0;
		let gear = character.equipment;
		let value:number = gear.reduce( (val: number,item: Gear) => {
					if (item.cost) {
						val = +val + +item.cost * (+item.count);
					}
					return val;
		}, 0);
		return value;
	}	
	toggleInUse(item: Gear, character: Character) {
		if (item.status != GEAR_STATUS.InUse) {
			item.status = GEAR_STATUS.InUse;
		} else {
			item.status = GEAR_STATUS.Stowed;
		}
		this.ds.updateCharacter(character);
	}
}
