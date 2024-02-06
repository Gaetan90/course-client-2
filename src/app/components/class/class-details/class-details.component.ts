import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Classes } from '../../../models/Classes';
import { Subscription, Observable, ReplaySubject, Subject, Observer } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { TeachingMode } from '../../../models/TeachingMode';
import { Client } from '../../../models/Client';
import { ClientService } from '../../../services/client.service';


import { states } from '../../../states.json';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { _filter } from '../../client/add-client/add-client.component';
import { ClassDetail } from '../../../models/ClassDetail';
import { Course } from '../../../models/Course';
import { Student } from '../../../models/Student';
import { Address } from '../../../models/Address';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
export interface StateGroup {
  letter: string;
  names: string[];
}

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent implements OnInit {

  stateGroups: StateGroup[] = states;

  stateGroupOptions: Observable<StateGroup[]>;

  ClassSubscription : Subscription;

  Class : Classes = new Classes();

  classDone : boolean = false

  TeachingModesSubscription : Subscription;

  TeachingModes: TeachingMode[];

  id:number | any;

  ClassForm: FormGroup = new FormGroup({});

  Courses: Course[];

  ClientAddresses: Address[];

  CourseListSubscription : Subscription;

  public filteredCourses: ReplaySubject<Course[]> = new ReplaySubject<Course[]>(1);

  public coursesFilterCtrl: FormControl = new FormControl();

  protected onDestroy = new Subject<void>();

  students : any[][] =[];

  public studentsFilterCtrl: FormControl[] = new Array<FormControl>();

  public filteredStudents: ReplaySubject<Student[]> = new ReplaySubject<Student[]>(1);

  coursesIndex = 0;

  isCertificate = true;
  isStudentCeu = true;
  isStudentCard = true;
  isRoster = true;
  isRosterCPR = true;

  CertificateList = [
    {
      'id': 1,
      'title': 'Certificate'
    },
    {
      'id': 2,
      'title': 'Student CEU'
    },
    {
      'id': 3,
      'title': 'Student Card'
    },
    {
      'id': 4,
      'title': 'Roster'
    },
    {
      'id': 5,
      'title': 'Roster CPR'
    }
  ]

  constructor(
    private CourseService: CourseService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {


    this.CourseService.getTeachingModes();
    this.TeachingModesSubscription = this.CourseService.TeachingModesSubject.subscribe(
      (TeachingModes : TeachingMode[]) => {
        this.TeachingModes = TeachingModes.filter(t => t.enable);
      }
    )
    this.CourseService.emitTeachingModesSubject();

    this.CourseService.getAllCourses();
    this.CourseListSubscription = this.CourseService.CourseListSubject.subscribe(
      (Courses : Course[]) => {
        this.Courses = Courses;
        if(this.classDone){
          this.filteredCourses.next(this.Courses);
        }else{
          this.filteredCourses.next(this.Courses.filter(c => c.enable));
        }

      }
    )
    this.CourseService.emitCourseListSubject();

    this.coursesFilterCtrl.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterCourses();
    });



    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.CourseService.getClass(this.id);
    this.ClassSubscription = this.CourseService.ClassSubject.subscribe(
      (Class : Classes) => {
        console.log("Class")
        console.log(Class)
        this.Class = Class;
        this.classDone = false;
        this.ClientAddresses = this.Class.client.Addresses;
        let idAddress = null;
        if(this.Class.client.Addresses.find(a => a.address1 == this.Class.address1 &&  a.city == this.Class.city) != null){
          idAddress = this.ClientAddresses.find(a => a.address1 == this.Class.address1 &&  a.city == this.Class.city).id;
        }
        this.isCertificate = this.Class.ClassesDetails.filter((cd) => cd.Course.isCertificate).length > 0?false:true;
        this.ClassForm = this.fb.group({

          number: new FormControl(this.Class.number),
          idAddress: new FormControl(idAddress),
          street: new FormControl(this.Class.address1),
          street2: new FormControl(this.Class.address2),
          city: new FormControl(this.Class.city),
          zip: new FormControl(this.Class.zip),
          state: new FormControl(this.Class.state),
          milesTravel: new FormControl(this.Class.milesTravel),
          mileAmount: new FormControl(this.Class.mileAmount),
          timeTravel: new FormControl(this.Class.timeTravel),
          discount: new FormControl(this.Class.discount),
          idClient: new FormControl(this.Class.client.name ),
          idTeachingMode: new FormControl(this.Class.TeachingMode.id),
          phoneNumber: new FormControl(this.Class.phoneNumber),
          emergencyContact: new FormControl(this.Class.emergencyContact),
          emergencyPhone: new FormControl(this.Class.emergencyPhone),
          note: new FormControl(this.Class.note),
          ClassDetails: this.fb.array([])
      });
      let control: FormArray = <FormArray>this.ClassForm.get('ClassDetails');

      let i =0;
      this.Class.ClassesDetails.forEach(obj => {
        control.push(this.initiatForm(obj));
        //control[i].get('idCourse').disable({ onlySelf: true });
        this.students[i] = this.Class.client.Students.filter(s => s.enable);

        this.filteredStudents[i] = new ReplaySubject<Student>(1)
        this.filteredStudents[i].next(this.students[i].slice());

        this.studentsFilterCtrl[i] = new FormControl();

        this.studentsFilterCtrl[i].valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          this.filterStudents(i);

        });
        i++;
      });
      this.coursesIndex = i;
      this.isCertificate = this.Class.ClassesDetails.filter(cd => cd.Course.isCertificate == true).length > 0?true:false;
      this.isStudentCeu = this.Class.ClassesDetails.filter(cd => cd.Course.isStudentCeu == true).length > 0?true:false;
      this.isStudentCard = this.Class.ClassesDetails.filter(cd => cd.Course.isStudentCard == true).length > 0?true:false;
      this.isRoster = this.Class.ClassesDetails.filter(cd => cd.Course.isRoster == true).length > 0?true:false;
      this.isRosterCPR = this.Class.ClassesDetails.filter(cd => cd.Course.isRosterCPR == true).length > 0?true:false;
      }
    )
    this.CourseService.emitClassSubject();

    this.stateGroupOptions = this.ClassForm.get('state')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );


  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  initiatForm(ClassDetail: ClassDetail): FormGroup {
    let form = this.fb.group({
      idClassDetail: [{ value: ClassDetail.id }],
      idCourse: [{ value: ClassDetail.Course.id, disabled: true }],
      startDate: new FormControl(ClassDetail.startDate),
      endDate: new FormControl(ClassDetail.endDate),
      cost: new FormControl(ClassDetail.cost),
      order: new FormControl(ClassDetail.order),
      idTeachingMode: [''],
      idStudents: [ClassDetail.Students.map(function(a) {return a.id;})],
    });
    form.get('endDate').valueChanges.subscribe(val => {
      if(form.get('startDate').value != undefined && new Date(val).getDay() != new Date(form.get('startDate').value).getDay()){

      }
    });
    return form;
  }

  initiatNewForm(): FormGroup {
    return this.fb.group({
      idClassDetail: [''],
      idCourse: [''],
      startDate: [''],
      endDate: [''],
      cost: [''],
      order: [''],
      idTeachingMode: [''],
      idStudents: [''],
    });
  }

  get formData(): FormArray{
    return <FormArray>this.ClassForm.get('ClassDetails');
  }

  filterCourses(){
    if (!this.Courses) {
      return;
    }
    // get the search keyword
    let search = this.coursesFilterCtrl.value;
    if (!search) {
      this.filteredCourses.next(this.Courses.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCourses.next(
      this.Courses.filter(Course => Course.title.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  addressSelected(id : number){
    let a : Address = this.ClientAddresses.find(a => a.id == id);
    this.ClassForm.get('street').setValue(a.address1);
    this.ClassForm.get('street2').setValue(a.address2);
    this.ClassForm.get('city').setValue(a.city);
    this.ClassForm.get('zip').setValue(a.zip);
    this.ClassForm.get('state').setValue(a.state);
  }

  startDateChange( index:number){
    const control = <FormArray>this.ClassForm.get('ClassDetails');
    const formGroup = <AbstractControl>control.at(index);
    let startDate = formGroup.get('startDate').value;
    let endDate = moment(startDate).add(this.Courses[index].duration, 'hours').toString();
    formGroup.get('endDate').setValue(new Date(endDate));
  }

  filterStudents(index : number){
    if (!this.students) {
      return;
    }
    // get the search keyword
    let search = this.studentsFilterCtrl[index].value;
    if (!search) {
      this.filteredStudents[index].next(this.students[index].slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredStudents[index].next(
      this.students[index].filter(student => student.lastName.toLowerCase().indexOf(search) > -1 || student.firstName.toLowerCase().indexOf(search) > -1)
    );
  }

  courseSelected(id : number, index:number){
    let course = this.CourseService.Courses.filter((course) => course.id == id)[0];
    this.Courses[index] = course;
    const control = <FormArray>this.ClassForm.get('ClassDetails');
    const formGroup = <AbstractControl>control.at(index);
    formGroup.get('cost').setValue(course.cost)
    if(course.TypeStudent.allSudent){
      this.students[index] = this.Class.client.Students.filter(s => s.enable);;
    }
    else{
      this.students[index] = this.Class.client.Students.filter((s) => s.TypeStudent.id == course.TypeStudent.id && s.enable)
    }
    this.filteredStudents[index] = new ReplaySubject<Student>(1)

    this.filteredStudents[index].next(this.students[index].slice());

    this.studentsFilterCtrl[index] = new FormControl();
    this.studentsFilterCtrl[index].valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterStudents(index);

    });
    this.startDateChange(index)
    formGroup.get('idStudents').setValue(this.students[index].map(({ id }) => id));


  }

  addCourse(index: number) {
    let control: FormArray = <FormArray>this.ClassForm.get('ClassDetails');

    control.push(this.initiatNewForm());
    if(index > 0){
      const LastFormGroup = <AbstractControl>control.at(index-1);
      const formGroup = <AbstractControl>control.at(index);
      let endDate = LastFormGroup.get('endDate').value;
      formGroup.get('startDate').setValue(new Date(endDate));
    }
    this.coursesIndex++;
  }

  removeCourse(index: number) {
    const control = <FormArray>this.ClassForm.get('ClassDetails');
    control.removeAt(index);

    this.coursesIndex--;
  }

  onUpdateClass(){
    const street = this.ClassForm.get('street').value;
    const street2 = this.ClassForm.get('street2').value;
    const city = this.ClassForm.get('city').value;
    const zip = this.ClassForm.get('zip').value;
    const state = this.ClassForm.get('state').value;
    const milesTravel = this.ClassForm.get('milesTravel').value;
    const timeTravel = this.ClassForm.get('timeTravel').value;
    const discount = this.ClassForm.get('discount').value;
    const mileAmount = this.ClassForm.get('mileAmount').value;
    const phoneNumber = this.ClassForm.get('phoneNumber').value;
    const emergencyContact = this.ClassForm.get('emergencyContact').value;
    const emergencyPhone = this.ClassForm.get('emergencyPhone').value;
    const note = this.ClassForm.get('note').value;
    const idTeachingMode = this.ClassForm.get('idTeachingMode').value;
    let controls = <FormArray>this.ClassForm.get('ClassDetails');
    console.log("controls.controls")
    console.log(controls.controls)

    let ClassDetails = new Array<ClassDetail>();
    for (let control of controls.controls) {
      const idClassDetail = control.get('idClassDetail').value.value;
      const idCourse = control.get('idCourse').value;
      const cost = control.get('cost').value;
      const order = control.get('order').value;
      const startDate = control.get('startDate').value;
      const endDate = control.get('endDate').value;
      const idStudents = control.get('idStudents').value;
      let ps = new Array<Student>();
      idStudents.forEach(element => {
        let p = new Student();
        p.id = element;
        ps.push(p)
      });
      let cd = new ClassDetail();
      cd.id = idClassDetail;
      cd.cost = cost;
      cd.order = order;
      cd.startDate = new Date(startDate);
      cd.endDate =  new Date(endDate);
      cd.Students = ps;
      let crse = new Course()
      crse.id = idCourse;
      cd.Course = crse;
      cd.Class = null;
      ClassDetails.push(cd)
    }

    let classFinal = new Classes();
    classFinal.id = this.Class.id
    classFinal.number = this.Class.number;
    classFinal.date = new Date( ClassDetails[0].startDate);
    let startDate = ClassDetails.sort((a, b) => {
      if (a.startDate < b.startDate){
        return -1;
      }else{
        return 1;
      }
    })[0].startDate;
    let endDate = ClassDetails.sort((a, b) => {
      if (a.startDate < b.startDate){
        return -1;
      }else{
        return 1;
      }
    })[ClassDetails.length-1].endDate;
    classFinal.startDate = new Date(startDate );
    classFinal.endDate = new Date( endDate);

    classFinal.paiementDate = this.Class.paiementDate;
    classFinal.address1 = street;
    classFinal.address2 = street2;
    classFinal.city = city;
    classFinal.zip = zip;
    classFinal.state = state;
    classFinal.milesTravel = milesTravel;
    classFinal.timeTravel = timeTravel;
    classFinal.discount = discount;
    classFinal.mileAmount = mileAmount;
    classFinal.note = note;
    classFinal.phoneNumber = phoneNumber;
    classFinal.emergencyContact = emergencyContact;
    classFinal.emergencyPhone = emergencyPhone;
    classFinal.Payements = this.Class.Payements;
    classFinal.note = note;
    classFinal.meetingUUID = this.Class.meetingUUID;
    classFinal.createDate = new Date( );

    let client = new Client()
    client.id = this.Class.client.id;
    classFinal.client = client;

    let teachingMode = new TeachingMode();
    teachingMode.id = idTeachingMode;
    classFinal.TeachingMode = teachingMode;

    classFinal.ClassesDetails = ClassDetails;

    this.CourseService.updateClass(classFinal).then(
      (res) => {
        if(res != null){
          this.router.navigate(['/classes']);
        }

      }
    );

  }

  download(oCertifcate) {

    switch(oCertifcate.value){
      case 1:
        const dialogRef = this.dialog.open(DialogCertificateName, {
          width: '600px',
          data: this.Class
        });

        dialogRef.afterClosed().subscribe(result => {
          this.CourseService.GeneratePDFCertificate(result);
        });

        break;
      case 2:
        this.CourseService.GeneratePDFStudentsCEU();
        break;
      case 3:
        this.CourseService.GeneratePDFStudentsCard();
        break;
      case 4:
        this.CourseService.GeneratePDFRoster();
        break;
      case 5:
        this.CourseService.GeneratePDFRosterCPR();
        break;
      case 6:
        this.CourseService.GeneratePDFRoster(true);
        break;
      case 7:
        this.CourseService.downloadOSHAInfoPdf();
        break;
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-certificate-nane.html',
})
export class DialogCertificateName implements OnInit{

  Providers: Student[];

  CertName: string;

  AddDoctorName: boolean | any;

  constructor(
    public dialogRef: MatDialogRef<DialogCertificateName>,
    @Inject(MAT_DIALOG_DATA) public data: Classes) {
      this.Providers = new Array<Student>();
    }


  ngOnInit(): void {
    this.Providers = this.data.client.Students.filter(s => s.isMainProvider);
    this.CertName = ( this.Providers[0].suffix!=null?this.Providers[0].suffix + ' ':'') + this.Providers[0].firstName + ' ' + this.Providers[0].lastName
    this.AddDoctorName = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  Export(){
    if(!this.AddDoctorName){
      this.CertName = null;
    }
    this.dialogRef.close(true);
  }

  CheckBoxChange(){
    this.AddDoctorName = !this.AddDoctorName
    this.CertName = null;
  }

}


