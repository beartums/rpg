import { Component, OnInit } from '@angular/core';
import { GmDataService } from '../gm-data.service';

@Component({
  selector: 'monster-encounter',
  templateUrl: './monster-encounter.component.html',
  styleUrls: ['./monster-encounter.component.css']
})
export class MonsterEncounterComponent implements OnInit {

	monsterCount: number;
	totalMonsters: number;
	monsterUploadInProgress: boolean = false;
	monster: any;

  constructor(private gmds: GmDataService) { }

  ngOnInit() {
  }
	uploadMonsters() {
		this.monsterUploadInProgress = true;
		let monsters = this.gmds.getFileMonsters();
		this.gmds.deleteMonster();
		this.monsterCount = 0;
		this.totalMonsters = monsters.length;

		monsters.forEach( monster => {
			this.monster = monster;
			this.monsterCount++
			this.gmds.addMonster(monster);
		});

		this.monsterUploadInProgress = false;
	}

}
