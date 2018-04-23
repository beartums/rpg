import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGearComponent } from './select-gear.component';

describe('SelectGearComponent', () => {
  let component: SelectGearComponent;
  let fixture: ComponentFixture<SelectGearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
