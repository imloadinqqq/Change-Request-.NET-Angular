import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstatsComponent } from './userstats.component';

describe('UserstatsComponent', () => {
  let component: UserstatsComponent;
  let fixture: ComponentFixture<UserstatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserstatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserstatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
