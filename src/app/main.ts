import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { DataService } from './data.service';
import { CharacterService } from './character.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

platformBrowserDynamic().bootstrapModule(AppModule);
