import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRequestStatusToggleButtonComponent } from './update-request-status-toggle-button.component';

describe('UpdateRequestStatusToggleButtonComponent', () => {
  let component: UpdateRequestStatusToggleButtonComponent;
  let fixture: ComponentFixture<UpdateRequestStatusToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRequestStatusToggleButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRequestStatusToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
