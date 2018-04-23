import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { GmDataService } from './gm-data.service';

import { ManageGamesComponent } from './manage-games/manage-games.component';
import { RunGameComponent } from './run-game/run-game.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { EditCharacterComponent } from './edit-character/edit-character.component';
import { EditGearComponent } from './edit-gear/edit-gear.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, SharedModule
  ],
  declarations: [ ManageGamesComponent, RunGameComponent, EditGameComponent, 
									EditCharacterComponent, EditGearComponent ],
	exports: [ ManageGamesComponent ],
	providers: [ GmDataService ]
})
export class GmModule { }
