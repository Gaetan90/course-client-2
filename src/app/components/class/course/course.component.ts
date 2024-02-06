import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/Course';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  _name:string;


  Courses: Course[];

  CourseListSubscription : Subscription;

  constructor(
    private CourseService : CourseService,
    private service : ClientService
  ) { }


  ngOnInit(): void {
    this.CourseService.getAllCourses();
    this.CourseListSubscription = this.CourseService.CourseListSubject.subscribe(
      (Courses : Course[]) => {
        this.Courses = Courses;
      }
    )
    this.CourseService.emitCourseListSubject();

    this.service.getTypeProviders();
    this.service.emitTypeStudentsListSubject(); 

    this.CourseService.getCourseCategories();
    this.CourseService.emitCourseCategoriesSubject(); 
  }


  @Input()
  set Course_filter(name: string) {
    if(name === ''){
      this.CourseService.emitCourseListSubject();
    }else{
      this.Courses = this.CourseService.Courses.filter(s => s.title.toUpperCase().includes(name.toUpperCase()))
    }
    
  }

  get Course_filter(): string { return this._name; }
}
