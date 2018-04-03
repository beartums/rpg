import { Component, OnInit, Input, OnChanges, 
					SimpleChanges, EventEmitter, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { Gear, Character } from '../../character.class';
import { EQUIPMENT } from '../../data/equipment';

@Component({
  selector: 'equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit, OnChanges {

	visibleTypes = new Set();
	
	@Input() isShopping: boolean = false;
	
	@Input() showTotals: boolean = false;
	
	@Input() showQuantity: boolean = false;
	
	@Input('gear') equipment?: Array<any>;
	
	@Input() title: string = null;
	
	@Input() isGrouped: Boolean = true;
	
	@Input() character: Character;
	
	@Input() isCart: boolean = true;

	@Output() cartChange: EventEmitter<Set<Gear>> = new EventEmitter<Set<Gear>>();
	@Input() cart: Set<Gear> = new Set();
	
	isOpenMap: Map<any, Boolean> = new Map();
	
	characterTotals = {
		weight: 0,
		value: 0
	}
	
  constructor(private ds: DataService) { }

  ngOnInit() {
		if (!this.equipment) {
			this.equipment = this.ds.getEquipment();
			if (this.isGrouped) this.equipment.sort(this.sortByTypeAndName);
		}
  }
	ngOnChanges(changes: SimpleChanges) {
		for (let prop in changes) {
			let changedProp = changes[prop];
			let isFirst = changedProp.isFirstChange();
			let prev = changedProp.previousValue;
			let curr = changedProp.currentValue;
			if (prop == 'isShopping') {
				if (!curr && this.cart.size > 0) {
					// message? 
					this.cart = new Set()
					this.isOpenMap = new Map();
				}
			}
			if (prop == 'equipment' && this.isGrouped) {
				changedProp.currentValue.sort(this.sortByTypeAndName);
			}
					
			if (prop == 'character') {
				this.setCharacterTotals(changedProp.currentValue);
			}
					
		}
	}
	
	cartAdd(event, item: Gear) {
		if (!item.count) item.count = 0;
		item.count++;
		if (!this.cart.has(item)) {
			this.cart.add(item)
		}
		this.cartChange.emit(this.cart);
		event.stopPropagation();
	}
	cartRemove(event, item: Gear) {
		if (!item.count) item.count = 0;
		if (item.count < 1) return;
		item.count--;
		if (this.cart.has(item) && item.count < 1) this.cart.delete(item);
		this.isOpenMap.delete(item);
		this.cartChange.emit(this.cart);
		event.stopPropagation();
	}
	
	getWeight(cart: Set<Gear> | Array<Gear>): number {
		let cartSet;
		if (Array.isArray(cart)) cartSet = new Set(cart);
		else cartSet = cart

		let totWeight = 0;
		cartSet.forEach((item) => {
			if (item.pounds && !isNaN(item.pounds)) {
			 totWeight += item.pounds * item.count;
			}
		});
		return totWeight
	}	
	
	getWeightClass(cart): string {
		let cartWeight = this.getWeight(cart);
		if (this.character && this.characterTotals.weight && this.isCart) 
			cartWeight += this.characterTotals.weight;
		if (cartWeight > 100) return 'text-danger';
		if (cartWeight > 40) return 'text-warning';
		return 'text-default';
	}

	getValue(cart: Set<Gear> | Array<Gear>): number {
		let cartSet;
		if (Array.isArray(cart)) cartSet = new Set(cart);
		else cartSet = cart

		let totVal = 0;
		cartSet.forEach(item=> {
			if (item.cost) {
				let denom = this.ds.getDenomination(item.denomination);
				let dVal = denom && denom.value ? denom.value : 1;
				totVal += item.cost * item.count * dVal;
			}
		});
		return totVal;
	}	
	
	getValueClass(cart, character): string {
		if (!this.isCart) return 'text-default';
		let cartValue = this.getValue(cart);
		if (this.character) return cartValue > character.gold ? 'text-danger' : 'text-default';
		return 'text-default';
	}
		
	setCharacterTotals(character: Character): any {
		let weight = this.getWeight(character.equipment.gear);
		let value = this.getValue(character.equipment.gear);
		this.characterTotals = {
			value: value,
			weight: weight
		}
	}
	
	isItemTypeVisible(type: string) {
		return this.visibleTypes.has(type);
	}
	
	getItemQuantity(item: any): string {
		if (!item.qty) return '';
		return `(${item.qty})`;
	}
	
	getItemProperties(item: any): string {
		let props = [];
		if (item.armorClass) props.push('AC: ' + item.armorClass);
		if (item.oneHandDamage) props.push('1H: ' + item.oneHandDamage);
		if (item.twoHandDamage) props.push('2H: ' + item.twoHandDamage);
		if (item.armorClassMod) props.push('ACMod: ' + item.armorClassMod);
		return props.join('; ');
	}
	
	sortByTypeAndName(a,b) {
		if (a.type > b.type) return 1;
		if (a.type < b.type) return -1;
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	};
	
	toggleItemTypeVisible(type: string) {
		if (this.visibleTypes.has(type)) this.visibleTypes.delete(type)
		else this.visibleTypes.add(type);
	}
	
	toggleShowDescription(item): void {
		if (!item.notes) return;
		let map = this.isOpenMap;
		map.set(item,!map.get(item));
	}

}
