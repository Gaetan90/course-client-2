import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/Course';
import { Router } from '@angular/router';
import { TypeStudent } from '../../../models/TypeStudent';
import { Subscription } from 'rxjs';
import { ClientService } from '../../../services/client.service';
import { CourseCategory } from '../../../models/CourseCategory';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  CourseForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    cost: new FormControl(''),
    duration: new FormControl(''),
    isReduction: new FormControl(''),
    isCertificate: new FormControl(''),
    isStudentCeu: new FormControl(''),
    isStudentCard: new FormControl(''),
    isRoster: new FormControl(''),
    isRosterCPR: new FormControl(''),
    titleCertificate: new FormControl(''),
    authorisedBy: new FormControl(''),
    authorisedCEUs: new FormControl(''),
    expiredMonth: new FormControl(''),
    idTypeStudent: new FormControl(''),
    idCourseCategorie: new FormControl(''),
  });
  TypeStudents: TypeStudent[];

  TypeStudentsSubscription : Subscription;

  CourseCategoriesSubscription : Subscription;

  CourseCategories: CourseCategory[];

  constructor(
    private CourseService : CourseService,
    private service : ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.CourseForm.get('cost').setValue('0')
    this.CourseForm.get('duration').setValue('0')

    this.service.getTypeProviders();

    this.TypeStudentsSubscription = this.service.TypeStudentsListSubject.subscribe(
      (TypeStudents : TypeStudent[]) => {
        this.TypeStudents = TypeStudents.filter(ts => ts.enable);;
      }
    )
    this.service.emitTypeStudentsListSubject();

    this.CourseService.getCourseCategories();

    this.CourseCategoriesSubscription = this.CourseService.CourseCategoriesSubject.subscribe(
      (CourseCategories : CourseCategory[]) => {
        this.CourseCategories = CourseCategories.filter(cc => cc.enable);
      }
    )
    this.service.emitTypeStudentsListSubject();
  }

  onAddCourse(){
    let title = this.CourseForm.get('title').value;
    let description = this.CourseForm.get('description').value;
    let cost = +this.CourseForm.get('cost').value;
    let duration = this.CourseForm.get('duration').value;
    let isReduction = this.CourseForm.get('isReduction').value;
    let isCertificate = this.CourseForm.get('isCertificate').value;
    let isStudentCeu = this.CourseForm.get('isStudentCeu').value;
    let isStudentCard = this.CourseForm.get('isStudentCard').value;
    let isRoster = this.CourseForm.get('isRoster').value;
    let isRosterCPR = this.CourseForm.get('isRosterCPR').value;
    let idTypeStudent = this.CourseForm.get('idTypeStudent').value;
    let idCourseCategorie = this.CourseForm.get('idCourseCategorie').value;
    let titleCertificate = this.CourseForm.get('titleCertificate').value;
    let expiredMonth = this.CourseForm.get('expiredMonth').value;
    let authorisedBy = this.CourseForm.get('authorisedBy').value;
    let authorisedCEUs = this.CourseForm.get('authorisedCEUs').value == ''?null:this.CourseForm.get('authorisedCEUs').value;
    if(isReduction && cost > 0){
      cost = cost*-1;
    }
    let course = new Course();

    course.title = title;
    course.description = description;
    course.cost = cost;
    course.duration = duration
    course.titleCertificate = titleCertificate
    course.isCertificate = titleCertificate != null && titleCertificate != ""?true:false;
    course.authorisedBy = authorisedBy
    course.authorisedCEUs = authorisedCEUs
    course.isReduction = isReduction;
    course.isCertificate = isCertificate;
    course.isStudentCeu = isStudentCeu;
    course.isStudentCard = isStudentCard;
    course.isRoster = isRoster;
    course.expiredMonth = expiredMonth;
    course.isRosterCPR = isRosterCPR;
    course.TypeStudent = new TypeStudent();
    course.TypeStudent.id = idTypeStudent;
    course.CourseCategory = new CourseCategory();
    course.CourseCategory.id = idCourseCategorie;

    this.CourseService.addCourse(course).then(
      () => {
        this.router.navigate(['/courses']);
      }
    );


  }

}
