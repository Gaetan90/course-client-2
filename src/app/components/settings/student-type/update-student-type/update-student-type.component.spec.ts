import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentTypeComponent } from './update-student-type.component';

describe('UpdateStudentTypeComponent', () => {
  let component: UpdateStudentTypeComponent;
  let fixture: ComponentFixture<UpdateStudentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [UpdateStudentTypeComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStudentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
