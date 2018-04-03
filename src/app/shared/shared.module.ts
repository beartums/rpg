import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectByLabelComponent }  from './select-by-label.component';

import { ModifierPipe } from './modifier.pipe';
import { CaseConvertPipe } from './case-convert.pipe';
import { ObjectAsValuesPipe } from './object-as-values.pipe';
import { EquipmentComponent } from './equipment/equipment.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [	SelectByLabelComponent, 
									ModifierPipe, 
									CaseConvertPipe, 
									ObjectAsValuesPipe, EquipmentComponent
	],
	exports: [		SelectByLabelComponent, 
									ModifierPipe, 
									CaseConvertPipe, 
									ObjectAsValuesPipe, EquipmentComponent 
	],
	providers: [ CaseConvertPipe ]
})
export class SharedModule { }
