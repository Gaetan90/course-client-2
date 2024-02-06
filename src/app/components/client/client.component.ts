import { Component, OnInit, Input, Inject, ViewChild, AfterViewInit } from '@angular/core';

import { Client } from '../../models/Client';
import { ClientService } from '../../services/client.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Student } from '../../models/Student';
import { MatTableDataSource } from '@angular/material/table';
import { Classes } from '../../models/Classes';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, AfterViewInit  {


  clientsSubscription : Subscription;
  clientSubscription : Subscription;
  _name :string;

  isSafari :boolean = false;

  client_list : Client[] =[];

  @ViewChild('clients2') clients2: MatSelectionList;

  @ViewChild('classesSelectInProgress') classesSelectInProgress: MatSelectionList;

  @ViewChild('classesSelectDone') classesSelectDone: MatSelectionList;

  clientSelected : Client ;

  classSelected : Classes = new Classes();

  displayedColumns: string[] = ['title', 'firstName', 'lastName', 'email', 'type','isMainProvider', 'delete','update'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource : MatTableDataSource<Student>;

  studentFilter = 2;

  constructor(
    private clientService : ClientService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.clientSelected = new Client();
  }

  ngOnInit() {
    this.isSafari = localStorage.getItem('browser') == 'Safari';
    this.clientService.getAllClients();
    this.clientsSubscription = this.clientService.clientsListSubject.subscribe(
      (clients : Client[]) => {
        this.client_list = clients;
        // this.client_list.forEach(cl => {
        //   if(cl.Classes.length > 0){
        //     cl.Classes.forEach(
        //       c => {
        //         if(c.ClassesDetails.length > 0){
        //           c.totalCost = c.ClassesDetails.map(cd => cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; });
        //           c._mainCourseTitle = c.ClassesDetails.length > 0 ?  c.ClassesDetails.sort(c => c.cost)[0].Course.title: '';
        //         }else{
        //           c.totalCost = 0;
        //           c._mainCourseTitle = '';
        //         }
        //       }
        //     )
        //   }
        // })
        if(this.client_list.length > 0){
          this.clientService.getClient(this.client_list.sort((a, b) => a.Classes.length > b.Classes.length ? -1 : 1)[0].id)
        }
      }
    )
    this.clientSubscription = this.clientService.clientSubject.subscribe(
      (client : Client) =>{
        this.clientSelected = client;
         if(this.clientSelected.Classes.length > 0){
            this.clientSelected.Classes.forEach(
              c => {
                if(c.ClassesDetails.length > 0){
                  c.totalCost = c.ClassesDetails.map(cd => cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; });
                  c._mainCourseTitle = c.ClassesDetails.length > 0 ?  c.ClassesDetails.filter(c => c.Course.isReduction == false).sort(c => c.cost)[0].Course.title: '';
                }else{
                  c.totalCost = 0;
                  c._mainCourseTitle = '';
                }
              }
            )
         }
        this.classSelected = this.clientSelected.Classes.filter(c => new Date(c.startDate) > new Date() ).sort((a, b) => a.startDate > b.startDate ? -1 : 1)[0]?? new Classes();
        this.dataSource = new MatTableDataSource(this.clientSelected.Students);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    )
    this.clientService.emitClientsListSubject();

  }

  ngAfterViewInit() {

  }

  @Input()
  set client(name: string) {
    if(name === ''){
      this.client_list = this.clientService.clients.sort((a, b) => a.Classes.length > b.Classes.length ? -1 : 1);
    }else{
      //this.client_list = this.clients.filter((client) => client.name.toUpperCase().includes(name.toUpperCase())).map(client => new Client().deserialize(client));
      console.log( this.client_list.find(c => c.id == 10))
      this.client_list = this.clientService.clients.filter((client) => {
        return (
          client.name.toUpperCase().includes(name.toUpperCase())
        ||
          client.MainProvider.lastName.toUpperCase().includes(name.toUpperCase())
        ||
          client.MainProvider.firstName.toUpperCase().includes(name.toUpperCase())
        )
      })
      if(this.client_list.length == 1){

      }
        //client.providers.filter((provider) => provider.lastName.toUpperCase().includes(name.toUpperCase()))).map(client => new Client().deserialize(client));
    }
  }

  get client(): string { return this._name; }

  clientListSelected(){
    this.clientService.getClient(this.clients2.selectedOptions.selected[0].value.id)
    this.clientService.emitClientSubject();
  }

  deleteClient(id:number){
    const dialogRef = this.dialog.open(DialogDeleteClient, {
      width: '400px',
      height:'300px',
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  isMainProvider(id : number){
    let student : Student = this.clientSelected.Students.find(s => s.id == id);
    student.isMainProvider = student.isMainProvider?false:true;
    this.clientService.updateStudent(student).then(res => {
      this.clientService.getClient( Number(this.route.snapshot.paramMap.get('id')));
      this.clientService.emitClientSubject();
    })

  }

  deleteStudent(id : number){
    this.clientService.deleteStudent(id).then(res => {
      this.clientService.getClient( Number(this.route.snapshot.paramMap.get('id')));
      this.clientService.emitClientSubject();
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-delete-client-dialog.html',
})
export class DialogDeleteClient {

  constructor(
    private clientService : ClientService,
    public dialogRef: MatDialogRef<DialogDeleteClient>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

    deleteClient(id : number){
      this.clientService.deleteClient(id).then(res => {
        this.clientService.getAllClients();
        this.clientService.emitClientsListSubject();
        this.dialogRef.close();
      });

    }
}

