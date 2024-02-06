import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTitleComponent } from './student-title.component';

describe('StudentTitleComponent', () => {
  let component: StudentTitleComponent;
  let fixture: ComponentFixture<StudentTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [StudentTitleComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
