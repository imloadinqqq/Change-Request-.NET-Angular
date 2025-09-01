import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardbuttonComponent } from './dashboardbutton.component';

describe('DashboardbuttonComponent', () => {
  let component: DashboardbuttonComponent;
  let fixture: ComponentFixture<DashboardbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardbuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
