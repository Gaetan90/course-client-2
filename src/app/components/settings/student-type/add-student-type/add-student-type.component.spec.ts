import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentTypeComponent } from './add-student-type.component';

describe('AddStudentTypeComponent', () => {
  let component: AddStudentTypeComponent;
  let fixture: ComponentFixture<AddStudentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [AddStudentTypeComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
