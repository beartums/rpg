import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCharacterAttributesComponent } from './create-character-attributes.component';

describe('CreateCharacterAttributesComponent', () => {
  let component: CreateCharacterAttributesComponent;
  let fixture: ComponentFixture<CreateCharacterAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCharacterAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCharacterAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
