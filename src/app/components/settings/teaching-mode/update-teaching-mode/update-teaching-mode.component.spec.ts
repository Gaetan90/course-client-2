import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeachingModeComponent } from './update-teaching-mode.component';

describe('UpdateTeachingModeComponent', () => {
  let component: UpdateTeachingModeComponent;
  let fixture: ComponentFixture<UpdateTeachingModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [UpdateTeachingModeComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTeachingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
