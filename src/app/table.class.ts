export class Table {
	name: string;
	type: string = "TableClass";
	description: string;
	rowLabelType: string|number; 			// e.g. 'Level'
	columnLabelType: string|number;			// e.g. 'Monster's HD'
	headers: Array<string|number> = [];
	headerClasses: Array<string> = [];
	valueRows: TableValueRow[] = [];
		
	constructor(name: string, description: string = "", rowType: string = "", colType: string = "") {
			this.name = name;
			this.description = description;
			this.rowLabelType = rowType;
			this.columnLabelType = colType;
	}
	addHeader(value:string|number) {
		this.headers.push(value);
	}
	
	addValueRow(label?: string|number, classes?: string, hideable?: boolean): TableValueRow {
		let row = new TableValueRow(label, classes, hideable);
		this.valueRows.push(row);
		return row;
	}

}

export class TableValueRow {
	rowLabel: string|number;			// e.g. 1, 2, 3, if yAxisLabel is 'Level'
	rowClasses: string;
	hideable: boolean;			// Is this a detail line -- info used for calculating
													// e.g. a saving throwh will have a roll needed, race mod, class mod, and att mod	
													//			which will add up to the actual value needed.
	values: Array<string|number> = [];
	columnClasses: Array<string> = [];
	
	constructor(label: string|number = "", classes: string = "", hideable: boolean = false) {
		this.rowLabel = label;
		this.rowClasses = classes;
		this.hideable = hideable;
	}
	
	addValue(value: string|number) {
		this.values.push(value);
	}
}