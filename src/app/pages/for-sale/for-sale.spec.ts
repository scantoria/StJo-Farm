import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForSale } from './for-sale';

describe('ForSale', () => {
  let component: ForSale;
  let fixture: ComponentFixture<ForSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
