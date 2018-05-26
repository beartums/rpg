import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSplitModule } from 'angular-split';


import { SelectByLabelComponent }  from './select-by-label.component';

import { ModifierPipe } from './modifier.pipe';
import { CaseConvertPipe } from './case-convert.pipe';
import { ObjectAsValuesPipe } from './object-as-values.pipe';
import { NotesListComponent } from './notes-list/notes-list.component';
import { ClickToEditComponent } from './click-to-edit/click-to-edit.component';
import { DisplayTableComponent } from './display-table/display-table.component';
import { SelectGearComponent } from './select-gear/select-gear.component';
import { CharacterListComponent } from './character-list/character-list.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, NgbModule,
    AngularSplitModule
  ],
  declarations: [	SelectByLabelComponent,
									ModifierPipe,
									CaseConvertPipe,
                  ObjectAsValuesPipe, NotesListComponent, ClickToEditComponent, DisplayTableComponent, SelectGearComponent, CharacterListComponent
	],
	exports: [		SelectByLabelComponent,
									ModifierPipe,
									CaseConvertPipe,
									ObjectAsValuesPipe,
									ClickToEditComponent, NotesListComponent, DisplayTableComponent, SelectGearComponent,
									CharacterListComponent, AngularSplitModule
	],
	providers: [ CaseConvertPipe ]
})
export class SharedModule { }
