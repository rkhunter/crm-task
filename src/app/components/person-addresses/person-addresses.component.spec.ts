import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAddressesComponent } from './person-addresses.component';

describe('PersonAddressesComponent', () => {
  let component: PersonAddressesComponent;
  let fixture: ComponentFixture<PersonAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
