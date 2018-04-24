import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
	class GearSummary {
			value: number = 0;
			valueUnit: string = 'gp';
			weight: number = 0;
			weightUnit: string = 'lbs';
			itemCount: number = 0;
		};
		
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { debounceTime, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

import * as _ from 'lodash';

import { Character, Gear, GEAR_STATUS } from '../../character.class';

import { CharacterService } from '../../character.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'select-gear',
  templateUrl: './select-gear.component.html',
  styleUrls: ['./select-gear.component.css','../../app-styles.css']
})
export class SelectGearComponent implements OnInit {
	
	@Input() sourceEquipment: Gear[];
	@Output() sourceEquipmentChange: EventEmitter<Gear[]> = new EventEmitter();
	
	@Input() targetEquipment: Gear[];
	@Output() targetEquipmentChange: EventEmitter<Gear[]> = new EventEmitter();
	
	@Input() sourceGold: number;
	@Output() sourceGoldChange: EventEmitter<number> = new EventEmitter();
	
	@Input() targetGold: number;
	@Output() targetGoldChange: EventEmitter<number> = new EventEmitter();
	
	@Output() onTransactionCompleted = new EventEmitter();
	
	@Input() allowSelections: boolean = true;
	
	@Input() allowAll: boolean = false;  // allow all items to show when (All) category is selected
	
	gearCategories: string[];
	selectedCategory: string;
	
	searchString: string;
	
	newItem: Gear = new Gear();
	
	selectableEquipment: Gear[] = [];  // 
	
	search$: Subject<string> = new Subject<string>();
	items$;
	items: Array<Gear>;
	
	itemsShowingInfo: Gear[] = [];
	
	selectedGearQuantity = new Map();
	
	selectedGearSummary: GearSummary = new GearSummary();
	sourceEquipmentSummary: GearSummary = new GearSummary();
	targetEquipmentSummary: GearSummary = new GearSummary();
	
	_targetEquipment;
	_sourceEquipment;
	
	GEAR_STATUS = GEAR_STATUS;
	
  constructor(private cs: CharacterService, private ds: DataService) {
	}

  ngOnInit() {

		this.selectableEquipment = this.setupDisplayItems(this.sourceEquipment)

		this.items$ = this.search$.pipe(
			tap(search=> console.log(search)),
			debounceTime(500),
			distinctUntilChanged(),
			switchMap( search => {
				this.searchString = search;
				let items = this.search(this.selectableEquipment, search, this.selectedCategory);
				this.items = items;
				return items;
			})
		)
		// subscribe to make it work
		this.items$.subscribe();
			
  }
	
	ngOnChanges(changes: SimpleChanges) {
		for (let prop in changes) {
			if (prop == 'sourceEquipment') {
				if (!changes[prop].currentValue) {
						changes[prop].currentValue=[]
						this.sourceEquipment = []
				}
				let sEquip = changes[prop].currentValue
				this._sourceEquipment = _.cloneDeep(sEquip);
				this.searchString = "";
				this.selectableEquipment = this.setupDisplayItems(sEquip);
				this.sourceEquipmentSummary = this.getGearSummary(this.selectableEquipment);
				this.selectedGearSummary = new GearSummary();
				this.selectedGearQuantity = new Map();
			} else if (prop == 'targetEquipment') {
				if (!changes[prop].currentValue) {
					changes[prop].currentValue=[];
					this.targetEquipment = [];
				}
				let tEquip = changes[prop].currentValue;
				this._targetEquipment = _.cloneDeep(tEquip);
				this.targetEquipmentSummary = this.getGearSummary(tEquip);
			} else if (prop == 'allowSelections') {
				this.selectableEquipment = this.setupDisplayItems(this.sourceEquipment)
			}
		}
	}
	
	ngDoCheck() {
		if (!_.isEqual(this._sourceEquipment,this.sourceEquipment)) {
			this._sourceEquipment = _.cloneDeep(this.sourceEquipment)
			let selectedCategory = this.selectedCategory;
			this.selectableEquipment = this.setupDisplayItems(this.sourceEquipment);
			this.selectedCategory = selectedCategory;
			this.search();
			this.sourceEquipmentSummary = this.getGearSummary(this.sourceEquipment);
			let itemsToDrop = [];
			this.selectedGearQuantity.forEach( (value, item) => {
				if (this.selectableEquipment.indexOf(item)<0) itemsToDrop.push(item);
			})
			itemsToDrop.forEach( item => this.selectedGearQuantity.delete(item) );
		}
		if (!_.isEqual(this._targetEquipment,this.targetEquipment)) {
			this._targetEquipment = _.cloneDeep(this.targetEquipment)
			this.targetEquipmentSummary = this.getGearSummary(this.targetEquipment);
		}
	}
		
	equipmentChangeProcessing(equipment) {
		
		equipment = equipment ? equipment : [];
		equipment = equipment.gear ? equipment.gear : [];
		
		return equipment;
	}
				
	setupDisplayItems(equipment: Gear[]): Gear[] {
		// if the source equipment is not specified, get all the available equipment
		let selectableEquipment = equipment || this.ds.getEquipment();
		this.gearCategories = this.getGearCategories(selectableEquipment, this.allowSelections);
		this.items = this.search(selectableEquipment);
		//this.selectedCategory = "(All)";
		return selectableEquipment;
	}
		
		
	getGearCategories(items: Gear[], allowSelections: boolean): string[] {
		let gearCategories = this.getGroupList(items);
		if (allowSelections) gearCategories.unshift('(Selected)');
		gearCategories.unshift('(All)');
		return gearCategories;
	}	
	createNewItem() {
	}
	
	getQuantity(item: Gear): string {
		if (item.qty) return `(${item.qty})`;
		else return '';
	}
	
	clearSearch() {
		this.searchString = "";
		this.items = this.search(this.selectableEquipment,this.searchString,this.selectedCategory);
	}
	
	clearSelected() {
		this.selectedGearQuantity = new Map();
		this.selectedGearSummary = new GearSummary();
	}
	
	getGroupList(equipment: Gear[]) {
		let groupSet = new Set();
		equipment.forEach( item => {
			groupSet.add(item.type);
		});
		let groupArray = Array.from(groupSet);
		return groupArray;
	}
		
	getItemProperties(item: any): string {
		let props = [];
		if (item.armorClass) props.push('AC: ' + item.armorClass);
		if (item.oneHandDamage) props.push('1H: ' + item.oneHandDamage);
		if (item.twoHandDamage) props.push('2H: ' + item.twoHandDamage);
		if (item.armorClassMod) props.push('ACMod: ' + item.armorClassMod);
		return props.join('; ');
	}
	
	getMatchingItems<T>(search: string, items: Array<T>, properties?: string[]): Array<T> {	
		if (!search.toLowerCase()) return [];
		search = search.toLowerCase();
		
		return items.filter( item => {
			return properties.some( prop => {
				let val = item[prop];
				if (!val || !val.toLowerCase || !val.indexOf) return false;
				if (val.toLowerCase().indexOf(search) > -1) return true;
				return false;
			});
		});
	}
	
	isSameItem(item: Gear, otherItem: Gear, propsToIgnore: string[] = ['count']): boolean {
		let props = _.union(Object.keys(item),Object.keys(otherItem));
		props = _.difference(props,propsToIgnore);
		for (let i = 0; i < props.length; i++) {
			let prop = props[i]
			if (item[prop]!=otherItem[prop]) return false;
		}
		return true;
	}
	
	search(items?, searchString?: string, category?: string) {
		items = items || this.selectableEquipment;
		searchString = searchString || this.searchString || "";
		category = category || this.selectedCategory || "(All)";
		
		if (category == "(All)" && searchString == "" && !this.allowAll) return [];
		let found = (category == "(Selected)") ? this.getSelectedItems() : items;
		
		if (searchString > "") found = this.getMatchingItems(this.searchString,found,['name']);
		if (category != '(All)' && category != "(Selected)")  {
			found = this.getMatchingItems(category,found,['type']);
		}
		
		return found;
	}
	
	selectCategory(category: string) {
		this.selectedCategory = category;
		this.items = this.search(this.selectableEquipment,this.searchString,this.selectedCategory)
	}
	
	isItemSelected(item: Gear): boolean {
		return this.selectedGearQuantity.has(item);
		//return this.isItemToggled(item,this.selectedItems)
	}
	
	changeSelectedQuantity(item: Gear, modQty: number): number {
		// if it doesn't already exist, put it in the table
		let qty = this.selectedGearQuantity.get(item);
		qty = isNaN(qty) ? modQty : qty + modQty;
		if (qty==0) this.selectedGearQuantity.delete(item);
		else this.selectedGearQuantity.set(item,qty);
		
		if (!this.selectedGearSummary) this.selectedGearSummary = new GearSummary();
		let cost = this.cs.getValueInUnits('gp',item.cost, item.denomination) * modQty;
		this.selectedGearSummary.value += (cost || 0)
					this.cs.getValueInUnits('gp',item.cost, item.denomination) * modQty;
		let weight = isNaN(item.pounds) ? 0 : item.pounds * modQty
		this.selectedGearSummary.weight += weight;
		this.selectedGearSummary.itemCount += modQty;
					
		return qty;
	}
	getSelectedItems() {
		let items = [];
		this.selectedGearQuantity.forEach( ( qty, item ) => {
			items.push(item);
		})
		return items;
	}
	selectedQuantity(item: Gear): number {
		return this.selectedGearQuantity.get(item) || 0;
	}

	canSelectItem(item) {
		if (!this.allowSelections) return false;
		if (!item.count) return true;  // Check availableGold
		return (item.count && item.count>this.selectedQuantity(item));
	}
	canUnselectItem(item): boolean {
		return this.selectedQuantity(item) > 0;
	}
	
	toggleInfo(ev, item: Gear) {
		ev.stopPropagation()
		this.toggleItem(item, this.itemsShowingInfo);
	}

	isShowingInfo(item: Gear): boolean {
		return this.isItemToggled(item,this.itemsShowingInfo)
	}
	
	toggleItem<T>(item: T, items: Array<T>): void {
		let idx = items.indexOf(item);
		if (idx > -1) items.splice(idx, 1);
		else items.push(item);
	}
	
	isItemToggled<T>(item: T, items:Array<T>): boolean {
		let idx = items.indexOf(item);
		if (idx>-1) return true;
		return false;
	}
	
	handleKeyup(ev) {
		this.search$.next(ev.target.value);
	}
	
	completeTransaction(mode: string,isGift:boolean) {
		
		// transactionGold: amount of gold this transsaction costs totals
		
		let transactionEquipment = [];
		let transactionGold = 0;
		let needRedisplay = false
		
		this.selectedGearQuantity.forEach( ( qty, item) => {
			
			let transItem = _.cloneDeep(item);
			transItem.count = qty;
			let transGold = qty * this.cs.getValueInUnits('gp',transItem.cost,transItem.denomination);
			transactionEquipment.push(transItem);
			
			if (!isGift) {
				transactionGold += transGold;
				if (this.sourceGold) this.sourceGold += transGold;
				if (this.targetGold) this.targetGold -= transGold;
			}
			
			if (this.sourceEquipment && item.count) {
				item.count -= qty;
				if (item.count == 0) this.sourceEquipment.splice(this.sourceEquipment.indexOf(item),1);
			}
			
			if (this.targetEquipment) {
				let tItem = this.targetEquipment.find( comp => {
						return this.isSameItem(item,comp);
				});
				let isCloned = !tItem;
				tItem = tItem || _.cloneDeep(item);
				tItem.count = tItem.count || 0;
				tItem.count = isCloned ? qty : tItem.count + qty;
				if (isCloned) this.targetEquipment.push(tItem);
			}
		});
			
		let transPackage = {
			source: {
				gold: this.sourceGold,
				equipment: this.sourceEquipment,
			},
			target: {
				gold: this.targetGold,
				equipment: this.targetEquipment,
			},
			transaction: {
				gold: transactionGold,
				equipment: transactionEquipment,
			}
		}

		// Notify the parent component
		this.sourceEquipmentChange.emit(this.sourceEquipment);
		this.targetEquipmentChange.emit(this.targetEquipment);
		this.sourceGoldChange.emit(this.sourceGold);
		this.targetGoldChange.emit(this.targetGold);
		
		// do this last so that the parent properties are ready for updating to DB
		this.onTransactionCompleted.emit(transPackage);
		
		// cleanup for redisplay
		//this.selectableEquipment = this.setupDisplayItems(this.sourceEquipment);
		this.selectedGearQuantity = new Map();
		this.selectedGearSummary = new GearSummary();
		this.sourceEquipmentSummary = this.getGearSummary(this.sourceEquipment);
		this.targetEquipmentSummary = this.getGearSummary(this.targetEquipment);
				
	}
	
	getGearSummary(items?: Gear[]): any {
		
		let totals = new GearSummary;
		if (!items) return totals;
		
		items.forEach(item => {
			totals.value += this.cs.getValueInUnits('gp',item.cost, item.denomination) * item.count;
			totals.weight += !isNaN(item.pounds) ? item.pounds * item.count : 0;
			totals.itemCount += item.count;
		});
			
		return totals;
	}

	toggleGearStatus(item:Gear) {
		if (item.status == GEAR_STATUS.InUse) item.status = GEAR_STATUS.Stowed;
		else item.status = GEAR_STATUS.InUse;
		this.sourceEquipmentChange.emit(this.sourceEquipment);
		this._sourceEquipment = _.cloneDeep(this.sourceEquipment);
	}
}
