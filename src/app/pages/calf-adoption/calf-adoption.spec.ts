import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalfAdoption } from './calf-adoption';

describe('CalfAdoption', () => {
  let component: CalfAdoption;
  let fixture: ComponentFixture<CalfAdoption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalfAdoption]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalfAdoption);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
