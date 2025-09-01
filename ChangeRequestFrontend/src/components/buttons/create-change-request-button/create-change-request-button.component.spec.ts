import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatechangrequestbuttonComponent } from './createchangrequestbutton.component';

describe('CreatechangrequestbuttonComponent', () => {
  let component: CreatechangrequestbuttonComponent;
  let fixture: ComponentFixture<CreatechangrequestbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatechangrequestbuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatechangrequestbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
