import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickToEditComponent } from './click-to-edit.component';

describe('ClickToEditComponent', () => {
  let component: ClickToEditComponent;
  let fixture: ComponentFixture<ClickToEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickToEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickToEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
