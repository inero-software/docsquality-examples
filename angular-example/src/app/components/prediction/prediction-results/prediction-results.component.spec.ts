import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionResultsComponent } from './prediction-results.component';

describe('ResultPageComponent', () => {
  let component: PredictionResultsComponent;
  let fixture: ComponentFixture<PredictionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
