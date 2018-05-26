import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
  selector: 'monster-lookup',
  templateUrl: './monster-lookup.component.html',
  styleUrls: ['./monster-lookup.component.css']
})
export class MonsterLookupComponent implements OnInit {

	@Input() items: any[];
	@Input() searchProperty: string = 'name'
	@Input() selected: any;
	@Output() selectedChange: EventEmitter<any> = new EventEmitter();
	
	isLoading: boolean = true;
	selectedItem;

  ngOnInit() {
	}
	
	ngOnDestroy() {
	}
	
	onChange(event) {
		//console.log(item);
		this.selectedChange.emit(event.item);
	}
	
	onFocus(ev) {
		ev.currentTarget.select();
	}

	formatMatches = (value: any) => {
		return value[this.searchProperty] || ''
	}
	
	search = (text$: Observable<string>) => {
		return text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			map(term => {
				let filtered = this.items.filter( item => {
					let val = item[this.searchProperty].toLowerCase();
					let isMatched = val.indexOf(term.toLowerCase()) > -1;
					return isMatched;
				});
				return filtered.slice(0,10);
			})
		)
	}
  
}
