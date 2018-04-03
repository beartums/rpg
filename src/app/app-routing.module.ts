import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { CharacterCreationComponent }   from './player/character-creation.component';
import { PlayerDashboardComponent }   from './player/player-dashboard/player-dashboard.component';
import { ManageGamesComponent }     from './gm/manage-games/manage-games.component';
import { RunGameComponent }     from './gm/run-game/run-game.component';
import { EditGameComponent }     from './gm/edit-game/edit-game.component';
import { MainMenuComponent }     from './main-menu/main-menu.component';

import { AuthGmGuard, AuthUserGuard } from './auth.guard';

const appRoutes: Routes = [
	{ path: 'main-menu', component: MainMenuComponent },
	{ path: 'player-dashboard', component: PlayerDashboardComponent,
		canActivate: [AuthUserGuard]},
	{ path: 'character-creation', component: CharacterCreationComponent,
		canActivate: [AuthUserGuard]},
	{ path: 'character-creation/:key/user/:userId', component: CharacterCreationComponent,
		canActivate: [AuthUserGuard]},
	{ path: 'manage-games', component: ManageGamesComponent,
		canActivate: [AuthGmGuard]},
	{ path: 'run-game/:key', component: RunGameComponent,
		canActivate: [AuthGmGuard]},
	{ path: 'edit-game/:key', component: EditGameComponent,
		canActivate: [AuthGmGuard]},
	{ path: '', redirectTo: '/main-menu', pathMatch: 'full' },
]

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes)
	],
	exports: [ RouterModule ],
	providers: [ AuthUserGuard, AuthGmGuard	]
})
export class AppRoutingModule {}
	
