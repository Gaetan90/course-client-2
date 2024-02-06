import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { CourseCategory } from '../../../models/CourseCategory';

@Component({
  selector: 'app-coursecategory',
  templateUrl: './coursecategory.component.html',
  styleUrls: ['./coursecategory.component.css']
})
export class CourseCategoryComponent implements OnInit {

  _name:string;

  CourseCategoriesSubscription : Subscription;

  CourseCategories: CourseCategory[];

  constructor(
    private CourseService: CourseService,
  ) { }

  ngOnInit(): void {
    this.CourseService.getCourseCategories();

    this.CourseCategoriesSubscription = this.CourseService.CourseCategoriesSubject.subscribe(
      (CourseCategories : CourseCategory[]) => {
        this.CourseCategories = CourseCategories;
      }
    ) 
    this.CourseService.emitCourseCategoriesSubject(); 
  }

  @Input()
  set CourseCategory_filter(name: string) {
    if(name === ''){
      this.CourseService.emitCourseCategoriesSubject();
    }else{
      this.CourseCategories = this.CourseService.CourseCategories.filter(cc => cc.name.toUpperCase().includes(name.toUpperCase()))
    }
  }

  get CourseCategory_filter(): string { return this._name; }

}
