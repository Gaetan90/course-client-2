import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseCategoryComponent } from './add-course-category.component';

describe('AddCourseCategoryComponent', () => {
  let component: AddCourseCategoryComponent;
  let fixture: ComponentFixture<AddCourseCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [AddCourseCategoryComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCourseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
