import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterEncounterComponent } from './monster-encounter.component';

describe('MonsterEncounterComponent', () => {
  let component: MonsterEncounterComponent;
  let fixture: ComponentFixture<MonsterEncounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterEncounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
