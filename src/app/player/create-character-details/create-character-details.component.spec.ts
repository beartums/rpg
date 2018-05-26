import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCharacterDetailsComponent } from './create-character-details.component';

describe('CreateCharacterDetailsComponent', () => {
  let component: CreateCharacterDetailsComponent;
  let fixture: ComponentFixture<CreateCharacterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCharacterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCharacterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
