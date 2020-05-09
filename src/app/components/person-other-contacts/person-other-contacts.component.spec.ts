import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonOtherContactsComponent } from './person-other-contacts.component';

describe('PersonOtherContactsComponent', () => {
  let component: PersonOtherContactsComponent;
  let fixture: ComponentFixture<PersonOtherContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonOtherContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonOtherContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
