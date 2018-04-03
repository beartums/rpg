import { Component, Input, OnChanges, SimpleChanges }              from '@angular/core';
import { Character, Attribute, SavingThrowDetail } from '../character.class';
import { CharacterService } from '../character.service';
import { DataService } from '../data.service';
import { HostListener } from '@angular/core';

@Component({
	selector: 'saving-throw-chart',
  templateUrl: './saving-throw-chart.component.html',
	styleUrls: ['../app.component.css'],
	providers: [CharacterService, DataService],
})

export class SavingThrowChartComponent implements OnChanges {
	race: any;
	charClass: any;
	savingThrowList: SavingThrowDetail[];
	changeLog: string[] = [];

	@Input() raceName: string;
	@Input() className: string;
	@Input() attributes: Attribute[];
	@Input() level: number;
	// HACK: used to deep-watch attributes so I don't have to build
	// an emitter
	@Input() attributesJson: string;

	constructor(private cs: CharacterService, private ds: DataService) {
		//this.race = this.ds.getRace(this.raceName);
		//this.charClass = this.ds.getClass(this.className);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.attributes && this.level) {
			this.getSavingThrowList();
		} else {
			this.savingThrowList = [];
		}
	}

	getSavingThrowList(): void {
		try {
			this.savingThrowList = this.cs.getSavingThrowList(this.level, this.raceName, this.className, this.attributes);
		} catch (e) {
			this.savingThrowList = [];
		}
	}


}
