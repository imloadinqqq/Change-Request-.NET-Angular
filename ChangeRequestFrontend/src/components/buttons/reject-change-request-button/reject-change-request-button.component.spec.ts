import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectChangeRequestButtonComponent } from './reject-change-request-button.component';

describe('RejectChangeRequestButtonComponent', () => {
  let component: RejectChangeRequestButtonComponent;
  let fixture: ComponentFixture<RejectChangeRequestButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectChangeRequestButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectChangeRequestButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
