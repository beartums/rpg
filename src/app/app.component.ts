import { Component }              from '@angular/core';
import { FormControl }            from '@angular/forms';


import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'my-app',
  template: 
		`<div class="container">
			<app-auth></app-auth>
			<router-outlet></router-outlet>
		</div>`,
	providers: [ ]
})
export class AppComponent  {
	title: string = "app works!";
	item: any;
  
	constructor() {

	}
	
	
}
