import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import { Gear } from '../../character.class';

@Component({
  selector: 'app-edit-gear',
  templateUrl: './edit-gear.component.html',
  styleUrls: ['./edit-gear.component.css']
})
export class EditGearComponent implements OnInit {
	
	@Input() gear: Gear;
	@Output() gearChange: EventEmitter<Gear> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

}
