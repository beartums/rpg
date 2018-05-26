import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

import { Monster, MonsterInstance } from '../../monster.class';
import { GmDataService } from '../gm-data.service';

@Component({
  selector: 'edit-monster',
  templateUrl: './edit-monster.component.html',
  styleUrls: ['./edit-monster.component.css']
})
export class EditMonsterComponent implements OnInit {

	@Input() monster: Monster;
	@Output() monsterChanges: EventEmitter<Monster> = new EventEmitter();

	@Input() isInstance: boolean = false;

	_monster: Monster;

  constructor(private gmds: GmDataService) { }

  ngOnInit() {
  }

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
   */
	isChanged(): boolean {
		return !_.isEqual(this.monster,this._monster);
	}
	save(monster: Monster) {
		this.gmds.updateMonster(monster.key, monster);
		this._monster = _.cloneDeep(this.monster);
	}
	reset() {
		this.monster = _.cloneDeep(this._monster);
	}
	cancel() {
	}
	stringify(obj) {
		return JSON.stringify(obj);
	}

}
