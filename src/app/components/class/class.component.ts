import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription, ReplaySubject, Subject, takeUntil } from "rxjs";
import { Classes } from "../../models/Classes";
import { Course } from "../../models/Course";
import { MatSelectionList, MatSelectionListChange } from "@angular/material/list";
import { CalendarEvent, CalendarView } from "angular-calendar";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { CourseService } from "../../services/course.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import * as XLSX from 'xlsx';
import * as moment from "moment";



const colors: any = {
  blue: {
    primary: '#1e90ff',
    secondary: '#d1e8ff',
    color: '#1e90ff',
  },
  pink: {
    primary: '#ff4081',
    secondary: '#f9a6c2',
    color: '#ff4081',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
})
export class ClassComponent implements OnInit {

  _name:string;

  isSafari : boolean = false;

  @ViewChild('content2', {static: false}) content2: ElementRef;

  classSubscription : Subscription;

  Classes : Classes[] =[];

  ListClasses : Array<Array<Classes>> = new Array<Array<Classes>>();

  Courses: Course[];

  CourseListSubscription : Subscription;

  coursesFilterCtrl: FormControl = new FormControl();

  filteredCourses: ReplaySubject<Course[]> = new ReplaySubject<Course[]>(1);

  protected onDestroy = new Subject<void>();


  @ViewChild('clients2') clients2: MatSelectionList;


  daysInWeek = 7;

  private destroy$ = new Subject();

  view: CalendarView = CalendarView.Week;

  viewDate: Date = new Date();

  locale: string = 'en';

  weekStartsOn : number = 0;

  CalendarView = CalendarView;

  events : CalendarEvent[] = new Array<CalendarEvent>();

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  selectedTab = 0;

  classSelected: any = new Classes()

  eventSelected: any ;

  constructor(
    private courseService : CourseService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef
  ) {

  }

  eventClicked(event : any){
    console.log('event')
    console.log(event.event)
    this.classDetails(Number(event.event.id));
  }

  ngAfterViewInit() {
    this.clients2.selectionChange.subscribe((s: MatSelectionListChange) => {
      let classSelected : Classes = this.clients2.selectedOptions.selected[0].value;
      this.viewDate = new Date(classSelected.startDate);
      if(this.eventSelected != null){
        this.eventSelected.color = colors.blue;
      }
      this.eventSelected = this.events.find(e => e.id == classSelected.id);
      this.eventSelected.color = colors.pink;
      this.classSelected = classSelected
      console.log(this.eventSelected)

    });
  }

  ngOnInit(): void {
    this.isSafari = localStorage.getItem('browser') == 'Safari';
    this.events = new Array<CalendarEvent>();

    this.courseService.getAllClasses();
    this.classSubscription = this.courseService.ClassesSubject.subscribe(
      (Classes : Classes[]) => {
        console.log(Classes)
        this.ListClasses = new Array<Array<Classes>>();

        this.Classes = Classes;

        this.ListClasses.push(this.Classes.filter(c => new Date(c.startDate)>= new Date()))
        this.ListClasses.push(this.Classes.filter(c => new Date(c.startDate) <= new Date()))
        this.InitializeEventList();
        this.refresh.next(null);
      }
    )
    this.courseService.emitClassesSubject();

    this.courseService.getAllCourses();
    this.CourseListSubscription = this.courseService.CourseListSubject.subscribe(
      (Courses : Course[]) => {
        this.Courses = Courses;

        this.filteredCourses.next(this.Courses.slice())

      }
    )
    this.courseService.emitCourseListSubject();

    console.log(this.filteredCourses)
    this.coursesFilterCtrl = new FormControl();
    this.coursesFilterCtrl.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterCourses();
    });


    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-width: 576px)',
        daysInWeek: 2,
      },
      medium: {
        breakpoint: '(max-width: 768px)',
        daysInWeek: 3,
      },
      large: {
        breakpoint: '(max-width: 960px)',
        daysInWeek: 5,
      },
    };

    this.breakpointObserver
      .observe(
        Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
        } else {
          this.daysInWeek = 7;
        }
        this.cd.markForCheck();
      });

  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }

  deleteClass(id:number){
    const dialogRef = this.dialog.open(DialogDeleteClass, {
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.selectedTab=0;
      }

    });
  }

  @Input()
  set Class_filter(name: string) {
    if(name === ''){
      this.Classes = this.courseService.Classes;
      this.InitializeEventList();
    }else{
      this.Classes = this.courseService.Classes.filter(cc => cc.client.name.toUpperCase().includes(name.toUpperCase()))
      this.ListClasses = new Array<Array<Classes>>();
      this.ListClasses.push(this.Classes.filter(c => new Date(c.startDate)>= new Date()))
      this.ListClasses.push(this.Classes.filter(c => new Date(c.startDate) <= new Date()))
      this.InitializeEventList();
    }
  }

  @Input()
  set DateRange(value: any) {
    let startDate = moment(value[0]) ;
    let endDate = moment(value[1]).add(1, 'day');
    this.Classes = this.courseService.Classes.filter(c => moment(c.startDate) > startDate && moment(c.startDate) < endDate)
    this.InitializeEventList();
  }

  @Input()
  set Courses_filter(value: Array<number>) {
    if(value.length == 0){
      this.courseService.emitClassesSubject();
      this.InitializeEventList();
    }
    else{
      this.Classes = this.courseService.Classes.filter(c => c.ClassesDetails.filter(cd => value.includes(cd.Course.id )).length > 0);
      this.InitializeEventList();
    }
  }

  get Class_filter(): string { return this._name; }

  InitializeEventList(){
    this.events = new Array<CalendarEvent>();
    this.Classes.forEach(c => {
      this.events.push(
        {
          id: c.id,
          start: new Date(c.startDate),
          end: new Date(c.endDate),
          title: c.client.name + "</br> " + c.ClassesDetails[0].Course.title,
          allDay: false,
          color: colors.blue,
          resizable:{
            beforeStart: false,
            afterEnd: false,
          },
          draggable: false,
        }
      )
    })
  }

  filterCourses(){
    if (!this.Courses) {
      return;
    }
    let search = this.coursesFilterCtrl.value;
    if (!search) {
      this.filteredCourses.next(this.Courses.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCourses.next(
      this.Courses.filter(c => c.title.toLowerCase().indexOf(search) > -1)
    );
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  classDetails(idClass: number){
    console.log('idClass')
    console.log(idClass)
    this.classSelected = this.Classes.find(c => c.id == idClass);
    this.selectedTab = 1;
  }

  exportexcel(): void
    {
       /* table id is passed over here */
       let element = document.getElementById('excel-table');
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, "File.xlsx");

    }

    filterClassInComming(classFilter: Classes) {
      return ( new Date(classFilter.startDate) > new Date());
    }

    filterClassDone(classFilter: Classes) {
      return !(new Date(classFilter.startDate) > new Date());
    }

    setView(view: CalendarView) {
      this.view = view;
    }

}



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-delete-class-dialog.html',
})
export class DialogDeleteClass {

  constructor(
    private courseService : CourseService,
    private router: Router,
    public dialogRef: MatDialogRef<DialogDeleteClass>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  deleteClass(id:number): void {
    this.courseService.deleteClass(id).then(res => {
      this.dialogRef.close(true);
      this.courseService.getAllClasses();
      this.courseService.emitClassesSubject();
    });

  }

  cancel(){
    this.dialogRef.close(false);
  }

}
