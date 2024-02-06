import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';
import { CourseService } from '../../../../services/course.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseCategory } from '../../../../models/CourseCategory';

@Component({
  selector: 'app-update-coursecategory',
  templateUrl: './update-coursecategory.component.html',
  styleUrls: ['./update-coursecategory.component.css']
})
export class UpdateCoursecategoryComponent implements OnInit {

  @Input() CourseCategory: CourseCategory;

  CourseCategoryForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    enable: new FormControl(''),
  })

  constructor(
    private CourseService: CourseService,
    private SettingsService : SettingsService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.CourseCategoryForm = new FormGroup({
      name: new FormControl(this.CourseCategory.name),
      description: new FormControl(this.CourseCategory.description),
      enable: new FormControl(this.CourseCategory.enable),
    })
  }

  onUpdateCourseCategory(){
    this.CourseCategory.name = this.CourseCategoryForm.get('name').value;
    this.CourseCategory.description = this.CourseCategoryForm.get('description').value;
    this.CourseCategory.enable = this.CourseCategoryForm.get('enable').value;
    this.SettingsService.updateCourseCategory(this.CourseCategory).then((res : CourseCategory) => {
      this.CourseService.emitCourseCategoriesSubject();
      this._snackBar.open('The Course Category ' + this.CourseCategory.name + ' has bees updated', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    })
  }

}
