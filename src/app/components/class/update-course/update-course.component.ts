import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Course } from '../../../models/Course';
import { CourseService } from '../../../services/course.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeStudent } from '../../../models/TypeStudent';
import { Subscription } from 'rxjs';
import { CourseCategory } from '../../../models/CourseCategory';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css']
})
export class UpdateCourseComponent implements OnInit {

  @Input() Course: Course;

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
    idTypeStudent: new FormControl(''),
    idCourseCategorie: new FormControl(''),
    expiredMonth: new FormControl(''),
    enable: new FormControl(''),
  });

  TypeStudents: TypeStudent[];

  TypeStudentsSubscription : Subscription;

  CourseCategoriesSubscription : Subscription;

  CourseCategories: CourseCategory[];

  constructor(
    private CourseService: CourseService
    , private _snackBar: MatSnackBar,
    private service : ClientService
  ) { }

  ngOnInit(): void {
    this.TypeStudentsSubscription = this.service.TypeStudentsListSubject.subscribe(
      (TypeStudents : TypeStudent[]) => {
        this.TypeStudents = TypeStudents.filter(ts => ts.enable);
      }
    )
    this.service.emitTypeStudentsListSubject();

    this.CourseCategoriesSubscription = this.CourseService.CourseCategoriesSubject.subscribe(
      (CourseCategories : CourseCategory[]) => {
        this.CourseCategories = CourseCategories.filter(cc => cc.enable);
      }
    )
    this.CourseService.emitCourseCategoriesSubject();

    this.CourseForm = new FormGroup({
      title: new FormControl(this.Course.title),
      description: new FormControl(this.Course.description),
      cost: new FormControl(this.Course.cost),
      duration: new FormControl(this.Course.duration),
      isReduction: new FormControl(this.Course.isReduction),
      isCertificate: new FormControl(this.Course.isCertificate),
      isStudentCeu: new FormControl(this.Course.isStudentCeu),
      isStudentCard: new FormControl(this.Course.isStudentCard),
      isRoster: new FormControl(this.Course.isRoster),
      isRosterCPR: new FormControl(this.Course.isRosterCPR),
      titleCertificate: new FormControl(this.Course.titleCertificate),
      authorisedBy: new FormControl(this.Course.authorisedBy),
      authorisedCEUs: new FormControl(this.Course.authorisedCEUs),
      expiredMonth: new FormControl(this.Course.expiredMonth),
      idTypeStudent: new FormControl(this.Course.TypeStudent.id),
      idCourseCategorie: new FormControl(this.Course.CourseCategory.id),
      enable: new FormControl(this.Course.enable),
    });
  }

  onUpdateCourse(){
    let title = this.CourseForm.get('title').value;
    let description = this.CourseForm.get('description').value;
    let cost =  +this.CourseForm.get('cost').value;
    let duration = this.CourseForm.get('duration').value;
    let isReduction = this.CourseForm.get('isReduction').value;
    let isCertificate = this.CourseForm.get('isCertificate').value;
    let isStudentCeu = this.CourseForm.get('isStudentCeu').value;
    let isStudentCard = this.CourseForm.get('isStudentCard').value;
    let isRoster = this.CourseForm.get('isRoster').value;
    let isRosterCPR = this.CourseForm.get('isRosterCPR').value;
    let idTypeStudent = this.CourseForm.get('idTypeStudent').value;
    let idCourseCategorie = this.CourseForm.get('idCourseCategorie').value;
    let enable = this.CourseForm.get('enable').value;
    let titleCertificate = this.CourseForm.get('titleCertificate').value;
    let authorisedBy = this.CourseForm.get('authorisedBy').value;
    let expiredMonth = this.CourseForm.get('expiredMonth').value;
    let authorisedCEUs = this.CourseForm.get('authorisedCEUs').value == ''?null:this.CourseForm.get('authorisedCEUs').value;
    if(isReduction && cost > 0){
      cost = cost*-1;
    }

    this.Course.id = this.Course.id;
    this.Course.title = title;
    this.Course.description = description;
    this.Course.cost = cost;
    this.Course.duration = duration;
    this.Course.titleCertificate = titleCertificate
    this.Course.isCertificate = titleCertificate != null?true:false;
    this.Course.authorisedBy = authorisedBy;
    this.Course.authorisedCEUs = authorisedCEUs
    this.Course.isReduction = isReduction;
    this.Course.isCertificate = isCertificate;
    this.Course.isStudentCeu = isStudentCeu;
    this.Course.isStudentCard = isStudentCard;
    this.Course.isRoster = isRoster;
    this.Course.isRosterCPR = isRosterCPR;
    this.Course.enable = enable;
    this.Course.expiredMonth = expiredMonth;

    this.Course.TypeStudent = new TypeStudent();
    this.Course.TypeStudent.id = idTypeStudent;

    this.Course.CourseCategory = new CourseCategory();
    this.Course.CourseCategory.id = idCourseCategorie;

    this.CourseService.updateCourse(this.Course).then(
      (result : any) => {
        this._snackBar.open('The Class ' + this.Course.title + ' has bees updated', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    );

  }
}
