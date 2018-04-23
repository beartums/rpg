import { Component, OnInit, Input } from '@angular/core';

import { Table, TableValueRow } from '../../table.class';
@Component({
  selector: 'display-table',
  templateUrl: './display-table.component.html',
  styleUrls: ['./display-table.component.css','../../app-styles.css']
})
export class DisplayTableComponent implements OnInit {
	
	@Input() table: Table;

  constructor() { }

  ngOnInit() {
  }

}
