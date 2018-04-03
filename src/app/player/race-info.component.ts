import { Component, Input, OnChanges, SimpleChanges }     from '@angular/core';
import { CharacterService } from '../character.service';
@Component({
	selector: 'race-info',
  templateUrl: './race-info.component.html',
	styleUrls: [],
	providers: [CharacterService],
})

export class RaceInfoComponent implements OnChanges {
	@Input() raceName: string;

	race: any[];

	constructor(private cs: CharacterService) {}

	ngOnChanges(changes: SimpleChanges):void {

		let change = changes["raceName"];
		if (!change) return;
		if (typeof change.currentValue !== 'string' || change.currentValue.length<=0) return;

		this.race = this.cs.getRace(change.currentValue);

	}


}
