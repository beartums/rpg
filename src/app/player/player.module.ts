import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';

import { CharacterCreationComponent }  from './character-creation.component';
import { SavingThrowChartComponent }  from './saving-throw-chart.component';
import { RaceInfoComponent }  from './race-info.component';
import { ClassInfoComponent }  from './class-info.component';
import { PlayerDashboardComponent } from './player-dashboard/player-dashboard.component';
import { CharacterSheetComponent } from './character-sheet/character-sheet.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, SharedModule, NgbModule,
  ],
  declarations:  [CharacterCreationComponent, 
									SavingThrowChartComponent, 
									RaceInfoComponent, 
									ClassInfoComponent, PlayerDashboardComponent, CharacterSheetComponent],
	exports: [ CharacterCreationComponent, 
									SavingThrowChartComponent,
									RaceInfoComponent, 
									ClassInfoComponent, 
					],
})
export class PlayerModule { }
