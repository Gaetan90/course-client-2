import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, FormArray, AbstractControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, Subscription, ReplaySubject, Subject, startWith, map, takeUntil, take } from "rxjs";
import { Address } from "../../../models/Address";
import { ClassDetail } from "../../../models/ClassDetail";
import { Classes } from "../../../models/Classes";
import { Client } from "../../../models/Client";
import { Course } from "../../../models/Course";
import { Student } from "../../../models/Student";
import { TeachingMode } from "../../../models/TeachingMode";
import { User } from "../../../models/User";
import { ClientService } from "../../../services/client.service";
import { CourseService } from "../../../services/course.service";
import { AuthService } from '../../../auth/services/auth.service';
import { _filter } from "../../client/add-client/add-client.component";
import { states } from "../../../states.json";
import * as moment from "moment";


export interface StateGroup {
  letter: string;
  names: string[];
}
export interface Travel {
  miles:number | any;
  duration:number | any;
}



@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css']
})
export class AddClassComponent implements OnInit {

  @Input() placeholderLabel = 'Search';

  stateGroups: StateGroup[] = states;

  stateGroupOptions: Observable<StateGroup[]>;

  clientSubscription : Subscription;

  client : Client = new Client();

  ClientSubscription : Subscription;

  lastClasses : Array<Classes> = new Array<Classes> ();

  ClientAddresses: Address[];

  course: Course;

  _name :string;

  clients : Client[] =[];

  students : any[][] =[];

  currentStudents : Student[] =[];

  ClassForm: FormGroup

  Courses: Course[];

  CourseListSubscription : Subscription;

  TeachingModesSubscription : Subscription;

  TeachingModes: TeachingMode[];

  public clientsFilterCtrl: FormControl = new FormControl();

  public coursesFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);

  public filteredCourses: ReplaySubject<Course[]> = new ReplaySubject<Course[]>(1);

  public studentsFilterCtrl: FormControl[] = new Array<FormControl>();

  public filteredStudents: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected onDestroy = new Subject<void>();

  coursesIndex = 0;

  constructor(
    private clientService : ClientService,
    private fb: FormBuilder,
    private CourseService : CourseService,
    private AuthService : AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  onAddClass(){
    const number = this.ClassForm.get('number')?.value;
    const street = this.ClassForm.get('street')?.value;
    const street2 = this.ClassForm.get('street2')?.value;
    const city = this.ClassForm.get('city')?.value;
    const zip = this.ClassForm.get('zip')?.value;
    const state = this.ClassForm.get('state')?.value;
    const milesTravel = this.ClassForm.get('milesTravel')?.value;
    const timeTravel = this.ClassForm.get('timeTravel')?.value;
    const mileAmount = this.ClassForm.get('mileAmount')?.value;
    const phoneNumber = this.ClassForm.get('phoneNumber')?.value;
    const emergencyContact = this.ClassForm.get('emergencyContact')?.value;
    const emergencyPhone = this.ClassForm.get('emergencyPhone')?.value;
    const note = this.ClassForm.get('note')?.value;
    const idClient = this.ClassForm.get('idClient')?.value;
    const idTeachingMode = this.ClassForm.get('idTeachingMode')?.value;
    let controls = <FormArray>this.ClassForm.get('ClassDetails');

    let ClassDetails = new Array<ClassDetail>();
    let classFinal = new Classes();
    for (let control of controls.controls) {
      const idCourse = control.get('idCourse')?.value;
      const cost = control.get('cost')?.value;
      const order = control.get('order')?.value;
      const startDate = control.get('startDate')?.value;
      const endDate = control.get('endDate')?.value;
      const idStudents = control.get('idStudents')?.value;
      let ps = new Array<Student>();
      idStudents.forEach( (element: any) => {
        let p = new Student();
        p.id = element;
        ps.push(p)
      });
      let cd = new ClassDetail();
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
    classFinal.paiementDate = null;
    classFinal.address1 = street;
    classFinal.address2 = street2;
    classFinal.city = city;
    classFinal.zip = zip;
    classFinal.state = state;
    classFinal.milesTravel = milesTravel;
    classFinal.timeTravel = timeTravel;
    classFinal.mileAmount = mileAmount;
    classFinal.note = note;
    classFinal.Payements = null;
    classFinal.phoneNumber = phoneNumber;
    classFinal.emergencyContact = emergencyContact;
    classFinal.emergencyPhone = emergencyPhone;
    classFinal.createDate = new Date( );
    classFinal.modifyDate = new Date( );

    classFinal.User = new User();
    classFinal.User.id = this.AuthService.currentUserValue.id;

    let client = new Client()
    client.id = idClient;
    classFinal.client = client;

    let teachingMode = new TeachingMode();
    teachingMode.id = idTeachingMode;
    classFinal.TeachingMode = teachingMode;

    classFinal.ClassesDetails = ClassDetails
    this.CourseService.addClass(classFinal).then(
      () => {
        this.router.navigate(['/classes']);
      }
    );

  }

  ngOnInit(): void {

    this.ClassForm = this.fb.group({
      number: new FormControl(''),
      idAddress: new FormControl(''),
      street: new FormControl(''),
      street2: new FormControl(''),
      city: new FormControl(''),
      zip: new FormControl(''),
      state: new FormControl(''),
      milesTravel: new FormControl(''),
      timeTravel: new FormControl(''),
      mileAmount: new FormControl(''),
      idClient: new FormControl(''),
      idTeachingMode: new FormControl(''),
      note: new FormControl(''),
      phoneNumber: new FormControl(''),
      emergencyContact: new FormControl(''),
      emergencyPhone: new FormControl(''),
      ClassDetails: this.fb.array([])
  });
    this.stateGroupOptions = this.ClassForm.get('state')!?.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );
    this.clientService.getAllClients();
    this.clientSubscription = this.clientService.clientsListSubject.subscribe(
      (clients : Client[]) => {
        this.clients = clients;
        this.ClassForm.get('idClient')?.setValue(clients[10]);
        this.filteredClients.next(this.clients.filter(c => c.enable).slice());
      }
    )
    this.clientService.emitClientsListSubject();

    this.CourseService.getAllCourses();
    this.CourseListSubscription = this.CourseService.CourseListSubject.subscribe(
      (Courses : Course[]) => {
        this.Courses = Courses;
        this.filteredCourses.next(this.Courses.filter(c => c.enable).slice());
      }
    )
    this.CourseService.emitCourseListSubject();

    this.CourseService.getTeachingModes();
    this.TeachingModesSubscription = this.CourseService.TeachingModesSubject.subscribe(
      (TeachingModes : TeachingMode[]) => {
        this.TeachingModes = TeachingModes.filter(t => t.enable);
      }
    )
    this.CourseService.emitTeachingModesSubject();

    this.ClientSubscription = this.clientService.clientSubject.subscribe(
      (client: Client) => {
        console.log('this.client')

        this.client = client;
        this.ClientAddresses = this.client.Addresses;
        this.ClassForm.get('idAddress')?.setValue(this.client.MainAddress.id);
        this.ClassForm.get('street')?.setValue(this.client.MainAddress.address1);
        this.ClassForm.get('street2')?.setValue(this.client.MainAddress.address2);
        this.ClassForm.get('city')?.setValue(this.client.MainAddress.city);
        this.ClassForm.get('zip')?.setValue(this.client.MainAddress.zip);
        this.ClassForm.get('state')?.setValue(this.client.MainAddress.state);
        this.ClassForm.get('emergencyContact')?.setValue(this.client.contactName);
        this.ClassForm.get('emergencyPhone')?.setValue(this.client.contactPhoneNumber);
        this.ClassForm.get('phoneNumber')?.setValue(this.client.phoneNumber);
        this.ClassForm.get('mileAmount')?.setValue(this.client.defaultTravelMilesAmount);

        if(this.TeachingModes.filter(t => t.isTravelMiles).map(t => t.id).includes(this.ClassForm.get('idTeachingMode')?.value)
          ){
          // this.CourseService.getTravel(this.client.MainAddress).then((response) =>{
          //   this.ClassForm.get('timeTravel').setValue((response['resourceSets'][0]['resources'][0]['travelDuration']/60/60).toFixed(2));
          //   this.ClassForm.get('milesTravel').setValue(response['resourceSets'][0]['resources'][0]['travelDistance'].toFixed(2));
          // })
        }else{
          this.ClassForm.get('timeTravel')?.setValue(0.00);
          this.ClassForm.get('milesTravel')?.setValue(0.00);
        }
        let Class = this.client.Classes.sort((a, b) => new Date(b.startDate).getDate() - new Date(a.startDate).getDate())[0]
      }
    )

    this.clientsFilterCtrl?.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterClients();
    });

    this.coursesFilterCtrl?.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterCourses();
    });



  }


  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  filterClients(){
    if (!this.clients) {
      return;
    }
    // get the search keyword
    let search = this.clientsFilterCtrl?.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredClients.next(
      this.clients.filter(client => client.name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterCourses(){
    if (!this.Courses) {
      return;
    }
    // get the search keyword
    let search = this.coursesFilterCtrl?.value;
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


  protected setInitialValue() {
    this.filteredClients
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Client, b: Client) => a && b && a.id === b.id;
      });
  }

  clientSelected(id : number){
    this.clientService.getClient(id);
    this.clientService.emitClientSubject();



  }

  addressSelected(id : number){
    let a : any = this.ClientAddresses.find(a => a.id == id);
    this.ClassForm.get('street')?.setValue(a.address1);
    this.ClassForm.get('street2')?.setValue(a.address2);
    this.ClassForm.get('city')?.setValue(a.city);
    this.ClassForm.get('zip')?.setValue(a.zip);
    this.ClassForm.get('state')?.setValue(a.state);
    if(this.TeachingModes.filter(t => t.isTravelMiles).map(t => t.id).includes(this.ClassForm.get('idTeachingMode')?.value)
      //&& this.ClassForm.get('idTeachingMode')?.value != this.TeachingModes.find(t => t.name === 'Seminar').id
      ){
      // this.CourseService.getTravel(a).then((response) =>{
      //   this.ClassForm.get('timeTravel').setValue((response['resourceSets'][0]['resources'][0]['travelDuration']/60/60).toFixed(2));
      //   this.ClassForm.get('milesTravel').setValue(response['resourceSets'][0]['resources'][0]['travelDistance'].toFixed(2));
      // })
    }else{
      this.ClassForm.get('timeTravel')?.setValue(0.00);
      this.ClassForm.get('milesTravel')?.setValue(0.00);
    }
  }

  courseSelected(id : number, index:number){
    this.course = this.CourseService.Courses.filter((course) => course.id == id)[0];
    var c = this.client.Classes.filter(c => c.ClassesDetails.filter(cc => cc.Course.id == this.course.id).length > 0);
    if(c.length > 0){
      this.lastClasses[index] = c.sort((a, b) => new Date(b.startDate).getDate() - new Date(a.startDate).getDate())[0]
    }else{
      this.lastClasses[index] = new Classes();
    }


    const control = <FormArray>this.ClassForm.get('ClassDetails');
    const formGroup = <AbstractControl>control.at(index);
    formGroup.get('cost')?.setValue(this.course.cost)
    if(formGroup.get('startDate')?.value != null){
      let startDate = formGroup.get('startDate')?.value;
      let endDate = moment(startDate).add(this.course.duration, 'hours').toString();
      formGroup.get('endDate')?.setValue(new Date(endDate));
    }

    if(this.course.TypeStudent.allSudent){
      this.students[index] = this.client.Students.filter(s => s.enable);
    }
    else{
      this.students[index] = this.client.Students.filter((s) => s.TypeStudent.id == this.course.TypeStudent.id && s.enable)
    }

    this.currentStudents = this.students[index].slice()
    this.filteredStudents[index] = new ReplaySubject<Student>(1)

    this.filteredStudents[index].next(this.students[index].slice());

    this.studentsFilterCtrl[index] = new FormControl();
    this.studentsFilterCtrl[index]?.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterStudents(index);

    });
    formGroup.get('idStudents')?.setValue(this.students[index].map(({ id }) => id));


  }

  startDateChange( index:number){
    const control = <FormArray>this.ClassForm.get('ClassDetails');
    const formGroup = <AbstractControl>control.at(index);
    let startDate = formGroup.get('startDate')?.value;
    let endDate = moment(startDate).add(this.Courses[index].duration, 'hours').toString();
    formGroup.get('endDate')?.setValue(new Date(endDate));
  }

  initiatForm(): FormGroup {
    return this.fb.group({
      idCourse: [''],
      startDate: [''],
      endDate: [''],
      cost: [''],
      order: [''],
      idTeachingMode: [''],
      idStudents: [''],
    });
  }

  addCourse(index: number) {
    let control: FormArray = <FormArray>this.ClassForm.get('ClassDetails');

    control.push(this.initiatForm());
    if(index > 0){
      const LastFormGroup = <AbstractControl>control.at(index-1);
      const formGroup = <AbstractControl>control.at(index);
      let endDate = LastFormGroup.get('endDate')?.value;
      formGroup.get('startDate')?.setValue(new Date(endDate));
    }
    this.coursesIndex++;
  }

  removeCourse(index: number) {
    const control = <FormArray>this.ClassForm.get('ClassDetails');
    control.removeAt(index);

    this.coursesIndex--;
  }

  filterStudents(index : number){
    if (!this.students) {
      return;
    }
    // get the search keyword
    let search = this.studentsFilterCtrl[index]?.value;
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



  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  get formData(): FormArray{
    return <FormArray>this.ClassForm.get('ClassDetails');
  }


  //get client(): string { return this._name; }

}
