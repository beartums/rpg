import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges }              from '@angular/core';

@Component({
	selector: 'select-by-label',
  templateUrl: './select-by-label.component.html',
	styleUrls: ['./select-by-label.component.css'],
	providers: [],
})

export class SelectByLabelComponent implements OnChanges {

	@Input() options: any[];
	@Input() disabledOptions: any[];
	@Input() displayProperty: string;
	@Input() selected: any;
	@Output() selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() disabled: boolean;
	@Input() direction: string = 'h';

	@Input() returnObject: string = 'true';
	@Input() collapseWhenSelected: string = 'false';

	private _returnObject: boolean = true;
	private _collapseWhenSelected: boolean = false;
	constructor() {
	}

	ngOnChanges(changes: SimpleChanges): void {
		let returnObjectChange = changes["returnObject"];
		if (returnObjectChange && returnObjectChange.currentValue.toLowerCase) {
			this._returnObject = (returnObjectChange.currentValue.toLowerCase() !== 'false');
		}
		let collapseChange = changes["collapseWhenSelected"];
		if (collapseChange && collapseChange.currentValue.toLowerCase) {
			this._collapseWhenSelected = collapseChange.currentValue.toLowerCase() !== 'false';
		}
		let direction = changes["direction"];
		if (direction) {
			let direction2 = direction.currentValue.toLowerCase();
			if (direction2 == 'h' || direction2 == 'horizontal') direction2 = 'h';
			if (direction2 == 'v' || direction2 == 'vertical' || direction2 == 'vert') direction2 = 'v';
			//this.changes['direction'].currentValue=direction;
			this.direction = direction2
		}
	}

	getDisplayValue(obj: any): string {
		if (!obj) return "";
		if (typeof obj === 'string') return obj;
		if (!this.displayProperty || typeof this.displayProperty != 'string' || !obj[this.displayProperty] || typeof obj[this.displayProperty] !== 'string') {
			return '!err';
		}
		return obj[this.displayProperty];
	}

	isSelected(obj: any): boolean {
		if (this._returnObject) {
			return obj === this.selected;
		} else {
			return this.getDisplayValue(obj) == this.selected;
		}
	}

	isDisabled(obj: any): boolean {
		if (this.disabled) return true
		let isDisabled: boolean = false;

		return isDisabled;
	}

	isIn(obj: any, objs: any[]): boolean {
		if (!objs) return false;
		let idx: number = objs.indexOf(obj);
		if (idx===-1) return false;
		return true;
	}

	isOptionVisible(obj: any): boolean {
		if (this.isSelected(obj)) return true;
		if (!this._collapseWhenSelected || !this.selected) {
				return true;
		}
		return false;
	}

	toggleSelection(obj: any, isDisabled: boolean): void {
		if (this.isDisabled(obj)) return;
		if (this._returnObject) {
			this.selected = this.selected === obj ? null : obj;
		} else {
			let val = this.getDisplayValue(obj);
			this.selected = this.selected === val ? null : val;
		}
		this.selectedChange.emit(this.selected);
	}
}
