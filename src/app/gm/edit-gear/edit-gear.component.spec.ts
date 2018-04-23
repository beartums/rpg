import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGearComponent } from './edit-gear.component';

describe('EditGearComponent', () => {
  let component: EditGearComponent;
  let fixture: ComponentFixture<EditGearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
