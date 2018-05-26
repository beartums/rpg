import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

import { Monster, MonsterInstance } from '../../monster.class';
import { GmDataService } from '../gm-data.service';
/**
 * Component for making changes to monster details.
 *
 * @export
 * @class EditMonsterComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
  selector: 'edit-monster',
  templateUrl: './edit-monster.component.html',
  styleUrls: ['./edit-monster.component.css']
})
export class EditMonsterComponent implements OnInit, OnChanges {

	/**
   * Send the changed monster back when it is saved
   *
   * @type {EventEmitter<Monster>}
   * @memberof EditMonsterComponent
   */
  @Output() monsterChanges: EventEmitter<Monster> = new EventEmitter();
  @Input() monster: Monster;

	@Input() isInstance: boolean = false;

	_monster: Monster;
  /**
   * Creates an instance of EditMonsterComponent.
   * @param {GmDataService} gmds
   * @memberof EditMonsterComponent
   * @constructor
   */
  constructor(private gmds: GmDataService) { }

  /**
   *
   * @param {SimpleChanges} changes
   * @returns
   * @memberof EditMonsterComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    for (let prop in changes) {
      if (prop=='monster') {
        this._monster = _.cloneDeep(changes[prop].currentValue);
      } else if (prop=='isInstance') {
      }
    }
  }
  /**
   *
   *
   * @memberof EditMonsterComponent
   */
  ngOnInit() {}
  /**
   * True if the monster has been changed and not saved
   *
   * @returns {boolean}
   * @memberof EditMonsterComponent
   */
  isChanged(): boolean {
		return !_.isEqual(this.monster,this._monster);
	}
  /**
   * Save the monster when required
   *
   * @param {Monster} monster
   * @memberof EditMonsterComponent
   */
  save(monster: Monster) {
		this.gmds.updateMonster(monster.key, monster);
		this._monster = _.cloneDeep(this.monster);
  }
 /**
  * Restore values over unsaved changes
  *
  * @memberof EditMonsterComponent
  */
 reset() {
		this.monster = _.cloneDeep(this._monster);
  }

	cancel() {
  }
 /**
  * give view access to stringify function
  *
  * @param {any} obj
  * @returns
  * @memberof EditMonsterComponent
  */
 stringify(obj) {
		return JSON.stringify(obj);
	}

}
