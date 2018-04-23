import { Component, OnInit, Input, Output, EventEmitter, 
				OnChanges, SimpleChanges, HostListener } from '@angular/core';

@Component({
  selector: 'click-to-edit',
  templateUrl: './click-to-edit.component.html',
  styleUrls: ['./click-to-edit.component.css']
})
export class ClickToEditComponent implements OnInit, OnChanges {

	@Input() type: string;
	
	@Output() valueChange: EventEmitter<string|number> = new EventEmitter();
	@Input() value: string | number;
	
	@Output() isEditingChange: EventEmitter<boolean> = new EventEmitter();
	@Input() isEditing: boolean = false;
	
	@Output() exitAction: EventEmitter<string> = new EventEmitter();
	
	_value: string | number;	
	
  constructor() { }

  ngOnInit() {
  }
	
	ngOnChanges(changes: SimpleChanges) {
		for (let prop in changes) {
			if (prop=='value') {
				this._value = changes[prop].currentValue;
			}
		}
	}
	
	@HostListener('document:click',['$event']) handleClick(ev) {
		this.handleEnter(ev);
	}
	
	changeValue() {
		if (this.value == this._value) return;
		this.value = this._value;
		this.valueChange.emit(this.value);
	}
	
	clickedInside(ev) {
		ev.preventDefault();
		ev.stopPropagation();
	}
	
	startEditing(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		this.setIsEditing(true);
	}
	
	setIsEditing(isEditing: boolean) {
		if (this.isEditing == isEditing) return;
		this.isEditing = isEditing;
		this.isEditingChange.emit(this.isEditing);
	}
	
	handleEscape(ev) {
		this._value = this.value;
		this.setIsEditing(false)
		this.exitAction.emit('escape')
	}
	handleEnter(ev) {
		this.changeValue();
		this.setIsEditing(false)
		this.exitAction.emit('enter')
	}
	handleTab(ev) {
		this.changeValue();
		this.setIsEditing(false)
		this.exitAction.emit('tab')
	}
}
