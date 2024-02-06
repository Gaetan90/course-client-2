import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentTitleComponent } from './update-student-title.component';

describe('UpdateStudentTitleComponent', () => {
  let component: UpdateStudentTitleComponent;
  let fixture: ComponentFixture<UpdateStudentTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [UpdateStudentTitleComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStudentTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
