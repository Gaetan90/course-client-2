import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeachingModeComponent } from './add-teaching-mode.component';

describe('AddTeachingModeComponent', () => {
  let component: AddTeachingModeComponent;
  let fixture: ComponentFixture<AddTeachingModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [AddTeachingModeComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeachingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
