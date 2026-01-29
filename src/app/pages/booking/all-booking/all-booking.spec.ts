import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBooking } from './all-booking';

describe('AllBooking', () => {
  let component: AllBooking;
  let fixture: ComponentFixture<AllBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
