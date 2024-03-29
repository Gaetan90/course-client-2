import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCategoryComponent } from './coursecategory.component';

describe('CoursecategoryComponent', () => {
  let component: CourseCategoryComponent;
  let fixture: ComponentFixture<CourseCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [CourseCategoryComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
