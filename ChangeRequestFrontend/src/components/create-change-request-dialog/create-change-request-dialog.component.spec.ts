import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChangeRequestDialogComponent } from './create-change-request-dialog.component';

describe('CreateChangeRequestDialogComponent', () => {
  let component: CreateChangeRequestDialogComponent;
  let fixture: ComponentFixture<CreateChangeRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChangeRequestDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChangeRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
