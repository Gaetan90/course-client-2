import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordionDisplayMode, MatExpansionPanel } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Classes } from '../../../models/Classes';
import { Client } from '../../../models/Client';
import { Student } from '../../../models/Student';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  @ViewChild('matExpansionPanelInComming') matExpansionPanelInComming : MatExpansionPanel;

  @ViewChild('classesSelectInProgress') classesSelectInProgress: MatSelectionList;

  @ViewChild('classesSelectDone') classesSelectDone: MatSelectionList;

  classSelected : Classes = new Classes();

  classSelectedDone : Classes = new Classes();

  displayedColumns: string[] = ['title', 'firstName', 'lastName', 'email', 'type','isMainProvider', 'delete','update'];

  displayedColumnsClass: string[] = ['number', 'startDate', 'TeachingMode', 'totalCost', '_mainCourseTitle', 'nbrCourse'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(MatPaginator, {static: true}) paginatorClass: MatPaginator;

  @ViewChild(MatSort, {static: true}) sortClass: MatSort;

  dataSource : MatTableDataSource<Student>;

  dataSourceClass : MatTableDataSource<Classes>;

  studentFilter = 2;

  private _client: Client;

  get Client(): any {
    return this._client;
  }

  @Input()
  set Client(val: any) {
    this._client = val;
    this.Client.Classes.forEach(c => {
      c._mainCourseTitle = c.ClassesDetails.length > 0 ?  c.ClassesDetails.filter(c => c.Course.isReduction == false).sort(c => c.cost)[0].Course.title: '';
    });
    console.log(val)
    this.classSelected = this.Client.Classes.filter(c => new Date(c.startDate) > new Date() ).sort((a, b) => a.startDate > b.startDate ? -1 : 1)[0]?? new Classes();
    this.classSelectedDone = this.Client.Classes.filter(c => new Date(c.startDate) < new Date() ).sort((a, b) => a.startDate > b.startDate ? -1 : 1)[0]?? new Classes();
    this.dataSource = new MatTableDataSource(this.Client.Students);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSourceClass = new MatTableDataSource(this.Client.Classes);
    this.dataSourceClass.sort = this.sortClass;
    this.dataSourceClass.paginator = this.paginatorClass;
  }

  constructor(
    private clientService : ClientService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    this.dataSourceClass.sort = this.sortClass;
    this.dataSourceClass.paginator = this.paginatorClass;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  isMainProvider(id : number){
    let student : Student = this.Client.Students.find(s => s.id == id);
    student.isMainProvider = student.isMainProvider?false:true;
    this.clientService.updateStudent(student).then(res => {
      this.clientService.getClient( Number(this.route.snapshot.paramMap.get('id')));
      this.clientService.emitClientSubject();
    })

  }

  deleteStudent(id : number){
    this.clientService.deleteStudent(id).then(res => {
      this._snackBar.open('Student has been updated', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    });
  }



  filterClassInComming(classFilter: Classes) {
    return ( new Date(classFilter.startDate) > new Date());
  }

  filterClassDone(classFilter: Classes) {
    return !(new Date(classFilter.startDate) > new Date());
  }

}
