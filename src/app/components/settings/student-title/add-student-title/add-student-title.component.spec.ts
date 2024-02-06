import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentTitleComponent } from './add-student-title.component';

describe('AddStudentTitleComponent', () => {
  let component: AddStudentTitleComponent;
  let fixture: ComponentFixture<AddStudentTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [AddStudentTitleComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStudentTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
