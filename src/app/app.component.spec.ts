/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent }  from './app.component';
import { CharacterCreationComponent }  from './player/character-creation.component';
import { SavingThrowChartComponent }  from './player/saving-throw-chart.component';
import { RaceInfoComponent }  from './player/race-info.component';
import { ClassInfoComponent }  from './player/class-info.component';
import { SelectByLabelComponent }  from './shared/select-by-label.component';
import {Ng2DragDropModule} from "ng2-drag-drop";

import { ModifierPipe } from './shared/modifier.pipe';
import { CaseConvertPipe } from './shared/case-convert.pipe';
import { ObjectAsValuesPipe } from './shared/object-as-values.pipe';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, NgbModule.forRoot(), Ng2DragDropModule ],
			declarations: [
        AppComponent, CharacterCreationComponent, SavingThrowChartComponent, SelectByLabelComponent, RaceInfoComponent, ClassInfoComponent, ModifierPipe, CaseConvertPipe, ObjectAsValuesPipe
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h2 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Character Sheet');
  }));
});
