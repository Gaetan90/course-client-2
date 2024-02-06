import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCoursecategoryComponent } from './update-coursecategory.component';

describe('UpdateCoursecategoryComponent', () => {
  let component: UpdateCoursecategoryComponent;
  let fixture: ComponentFixture<UpdateCoursecategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [UpdateCoursecategoryComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCoursecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
