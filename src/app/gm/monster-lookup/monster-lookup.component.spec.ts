import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterLookupComponent } from './monster-lookup.component';

describe('MonsterLookupComponent', () => {
  let component: MonsterLookupComponent;
  let fixture: ComponentFixture<MonsterLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
