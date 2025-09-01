import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveChangeRequestButtonComponent } from './approve-change-request-button.component';

describe('ApproveChangeRequestButtonComponent', () => {
  let component: ApproveChangeRequestButtonComponent;
  let fixture: ComponentFixture<ApproveChangeRequestButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveChangeRequestButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveChangeRequestButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
