import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserButtonToggleComponent } from './update-user-button-toggle.component';

describe('UpdateUserButtonToggleComponent', () => {
  let component: UpdateUserButtonToggleComponent;
  let fixture: ComponentFixture<UpdateUserButtonToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUserButtonToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserButtonToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
