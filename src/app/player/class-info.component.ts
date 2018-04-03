import { Component, Input, OnChanges, SimpleChanges }     from '@angular/core';
import { CharacterService } from '../character.service';
@Component({
	selector: 'class-info',
  templateUrl: './class-info.component.html',
	styleUrls: [],
	providers: [CharacterService],
})

export class ClassInfoComponent implements OnChanges {
	@Input() className: string;

	charClass: any;
	spells: any[];
	spellLevelVisible: any;

	constructor(private cs: CharacterService) {}

	ngOnChanges(changes: SimpleChanges):void {

		let change = changes["className"];
		if (!change) return;
		if (typeof change.currentValue !== 'string' || change.currentValue.length<=0) return;

		this.charClass = this.cs.getClass(change.currentValue);
		this.spells = this.getSpells(change.currentValue);
		this.spellLevelVisible = {};
	}

	getSpells(className?:string, level?: number): any[] {
		className = className || this.charClass.name;
		return this.cs.getSpells(className, level);
	}

	toggleSpellLevelVisible(level: number): void {
		this.spellLevelVisible[level] = !this.spellLevelVisible[level]
	}
	isSpellLevelVisible(level: number): boolean {
		return this.spellLevelVisible[level]
	}

}
