import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from '../../../../services/settings.service';
import { CourseService } from '../../../../services/course.service';
import { CourseCategory } from '../../../../models/CourseCategory';

@Component({
  selector: 'app-add-course-category',
  templateUrl: './add-course-category.component.html',
  styleUrls: ['./add-course-category.component.css']
})
export class AddCourseCategoryComponent implements OnInit {

  
  CourseCategoryForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  })
  
  constructor(
    private CourseService: CourseService,
    private SettingsService : SettingsService
  ) { }

  ngOnInit(): void {
  }

  onAddCourseCategory(){
    let courseCategory = new CourseCategory();
    courseCategory.name = this.CourseCategoryForm.get('name').value;
    courseCategory.description = this.CourseCategoryForm.get('description').value;
    courseCategory.enable = true;
    this.SettingsService.addCourseCategory(courseCategory).then((res : CourseCategory) => {
      this.CourseService.CourseCategories.push(res);
      this.CourseService.emitCourseCategoriesSubject();
    })

  }

}
