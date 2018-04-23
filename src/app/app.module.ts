import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';

import { AuthService } from './auth.service';
import { DataService } from './data.service';

import { AppComponent }  from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthComponent } from './auth/auth.component';
import { CharacterService } from './character.service';

//import { GmComponent } from './gm/gm.component';
import { GmModule } from './gm/gm.module';
import { PlayerModule } from './player/player.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports:      [ BrowserModule, FormsModule, NgbModule.forRoot(),
									AngularFireModule.initializeApp(environment.firebase),
									AngularFireAuthModule, AngularFireDatabaseModule, AppRoutingModule, GmModule, 
									PlayerModule, SharedModule ],
  declarations: [ AppComponent, 
									AuthComponent 
							],
  bootstrap:    [ AppComponent ],
	providers: [ AuthService, DataService, CharacterService ],
	exports: [ FormsModule ],
})
export class AppModule { }
