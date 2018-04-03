import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GmDataService } from './gm-data.service';

import { ManageGamesComponent } from './manage-games/manage-games.component';
import { RunGameComponent } from './run-game/run-game.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { EditCharacterComponent } from './edit-character/edit-character.component';

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  declarations: [ ManageGamesComponent, RunGameComponent, EditGameComponent, EditCharacterComponent ],
	exports: [ ManageGamesComponent ],
	providers: [ GmDataService ]
})
export class GmModule { }
