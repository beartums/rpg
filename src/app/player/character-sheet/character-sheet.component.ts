import { Component, OnInit, ChangeDetectorRef }    from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Character, Attribute, STAGE, Gear, GEAR_STATUS, Weapon, Armor } from '../../character.class';
import { CharacterService } from '../../character.service';
import { DataService } from '../../data.service';
import * as _ from 'lodash';
import { delay } from 'rxjs/operators';

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

  ACColorClass: string = ""

	constructor(public cs: CharacterService, private ds: DataService,
              private router: Router, private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
	}

	ngOnInit() {
		this.route.paramMap.subscribe( params => {
			this.characterKey = params.get('key');
      this.character$ = this.ds.fetchCharacter$(this.characterKey);
		})
  }


	getAc(character: Character): number {
		return this.cs.getArmoredArmorClass(character);
  }

  /**
   * Change the color of the Heart (HP Icon) based on current damage
   *
   * @param {Character} character
   * @returns {string} Name of class corresponding to color
   *
   * @memberOf CharacterSheetComponent
   */
  getHPColorClass(character:Character): string {
    let hp = character.hitPoints || 1;
    let thp = character.temporaryHitPoints;
    if (!thp && thp!==0) return "healthy";
    let hpPercent = thp/hp;
    if (hpPercent>.9) return "healthy"
    else if (hpPercent>.6) return "hurt"
    else if (hpPercent>.3) return "hurt"
    else if (hpPercent>.1) return "hurt-badly"
    else return "dead fa-1x";
  }

  /**
   * Shield Icon should turn green if the character has any armor
   *
   * @param {Character} character
   * @returns {string} 'text-success' if the character is armored
   *
   * @memberOf CharacterSheetComponent
   */
  getACColorClass(character:Character): string {
     if (this.cs.getIsArmored(character)) return 'text-success';
     else return "";
  }

  /**
   * String relaying Attack and protection info about the item
   *
   * @param {*} item Item to
   * @returns {string} Concatenated string of properties
   *
   * @memberOf CharacterSheetComponent
   */
  getItemProperties(item: Gear | Armor | Weapon): string {
    let props = [];
    if (item instanceof Armor) {
      if (item.armorClassMod) props.push('ACMod: ' + item.armorClassMod);
      if (item.armorClass) props.push('AC: ' + item.armorClass);
    } else if (item instanceof Weapon) {
      if (item.oneHandDamage) props.push('1H: ' + item.oneHandDamage);
      if (item.twoHandDamage) props.push('2H: ' + item.twoHandDamage);
    }
		return props.join('; ');
	}

  /**
   * Get the weight of the items currently carried by the character
   *
   * @param {Character} character
   * @returns {number} Weight in pounds of all items the character is carrying
   *
   * @memberOf CharacterSheetComponent
   */
  getWeight(character: Character): number {
		if (!character || ! character.equipment) return 0;
		let gear = character.equipment;
		let weight:number = gear.reduce( (wt: number,item: Gear) => {
					if (item.status !== GEAR_STATUS.Stored && item.pounds) {
						wt = +wt + +item.pounds * (+item.count);
					}
					return wt;
		}, 0);
		return weight;
	}

  /**
   * Get the value of an equipment list form a character
   *
   * @param {any} character
   * @returns {number} GP value of the equipment list
   *
   * @memberOf CharacterSheetComponent
   */
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

  /**
   * Toggle item from inUse to Stowed
   *
   * @param {Gear} item Item to toggle
   * @param {Character} character Character who owns item
   *
   * @memberOf CharacterSheetComponent
   */
	toggleInUse(item: Gear, character: Character) {
		if (item.status !== GEAR_STATUS.InUse) {
			item.status = GEAR_STATUS.InUse;
		} else {
			item.status = GEAR_STATUS.Stowed;
		}
		this.ds.updateCharacter(character);
	}
}
