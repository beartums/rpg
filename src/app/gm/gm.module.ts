import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';

import { GmDataService } from './gm-data.service';

import { ManageGamesComponent } from './manage-games/manage-games.component';
import { RunGameComponent } from './run-game/run-game.component';
import { EditGameComponent } from './edit-game/edit-game.component';
import { EditCharacterComponent } from './edit-character/edit-character.component';
import { EditGearComponent } from './edit-gear/edit-gear.component';
import { MonsterEncounterComponent } from './monster-encounter/monster-encounter.component';
import { MonsterLookupComponent } from './monster-lookup/monster-lookup.component';
import { EditMonsterComponent } from './edit-monster/edit-monster.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, SharedModule, NgbModule
  ],
  declarations: [ ManageGamesComponent, RunGameComponent, EditGameComponent, 
									EditCharacterComponent, EditGearComponent, MonsterEncounterComponent, MonsterLookupComponent, EditMonsterComponent ],
	exports: [ ManageGamesComponent ],
	providers: [ GmDataService ]
})
export class GmModule { }
