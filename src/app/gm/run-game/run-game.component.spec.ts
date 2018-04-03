import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunGameComponent } from './run-game.component';

describe('RunGameComponent', () => {
  let component: RunGameComponent;
  let fixture: ComponentFixture<RunGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
