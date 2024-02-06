import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';

import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { states } from '../../../states.json';

import { Client } from '../../../models/Client';
import { Student } from '../../../models/Student';
import { ClientService } from '../../../services/client.service';
import { Subscription, Observable, ReplaySubject, Subject } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { StateGroup, _filter } from '../add-client/add-client.component';
import { DialogDeleteClass } from '../../class/class.component';
import { find, takeUntil, startWith, map } from 'rxjs/operators';
import { Address } from '../../../models/Address';
import { TitleStudent } from '../../../models/TitleStudent';
import { ClientType } from '../../../models/ClientType';
import { TypeStudent } from '../../../models/TypeStudent';

import * as XLSX from 'xlsx';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})


export class ClientDetailComponent implements OnInit, AfterViewInit {

  displayAddress: boolean = false;

  stateGroups: StateGroup[] = states;

  stateGroupOptions: Observable<StateGroup[]>;

  stateGroupOptionsList: Array<Observable<StateGroup[]>> = new Array<Observable<StateGroup[]>>();

  client : Client;

  clientAdress : Address = new Address;

  clientForm = new FormGroup({
    idTypeClient: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    street: new FormControl(''),
    street2: new FormControl(''),
    zip: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    email2: new FormControl('', [ Validators.email]),
    phoneNumber : new FormControl(''),
    cellNumber: new FormControl(''),
    fax: new FormControl(''),
    website: new FormControl(''),
    note: new FormControl(''),
    contactName: new FormControl(''),
    contactEmail: new FormControl('', [Validators.email]),
    contactPhoneNumber: new FormControl(''),
    defaultTravelMilesAmount: new FormControl(2),
  });

  addressForms: FormArray ;

  mainProviderForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    suffix: new FormControl(''),
    phoneNumber: new FormControl(''),
    idTitleProvider: new FormControl(''),
    stateBoardLicense: new FormControl(''),
    dea: new FormControl(''),
    email: new FormControl('', [Validators.email]),
  });

  Student_search : string;

  id:number | any;

  displayedColumns: string[] = ['title', 'firstName', 'lastName', 'email', 'type','isMainProvider', 'delete','update'];

  dataSource : MatTableDataSource<Student>;

  clientSubscription : Subscription;

  TitleStudents: TitleStudent[];

  TitleStudentsSubscription : Subscription;

  ClientTypes: ClientType[] = [];

  TypeClientsSubscription : Subscription;

  public TypeClientsFilterCtrl: FormControl = new FormControl();

  public filteredTypeClients: ReplaySubject<ClientType[]> = new ReplaySubject<ClientType[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  file: DataTransfer;

  fileName: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public  clientService : ClientService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(){
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.getClient(this.id);
    this.clientSubscription = this.clientService.clientSubject.subscribe(
      (client : Client) => {
        this.client = client;
        this.client.Classes.forEach(c => {
          c.totalCost = c.ClassesDetails.map(cd => cd.cost * cd.Students.length).reduce(function(a, b){ return a + b; });
        })
        this.dataSource = new MatTableDataSource(this.client.Students);
        this.dataSource.sort = this.sort;
        this.clientForm.get('idTypeClient').setValue(this.client.ClientType.id.toString());
        this.clientForm.get('name').setValue(this.client.name);
        this.clientForm.get('description').setValue(this.client.description);
        this.clientForm.get('street').setValue(this.client.MainAddress.address1);
        this.clientForm.get('street2').setValue(this.client.MainAddress.address2);
        this.clientForm.get('zip').setValue(this.client.MainAddress.zip);
        this.clientForm.get('city').setValue(this.client.MainAddress.city);
        this.clientForm.get('state').setValue(this.client.MainAddress.state);
        this.clientForm.get('email').setValue(this.client.email);
        this.clientForm.get('email2').setValue(this.client.email2);
        this.clientForm.get('phoneNumber').setValue(this.client.phoneNumber);
        this.clientForm.get('cellNumber').setValue(this.client.cellNumber);
        this.clientForm.get('fax').setValue(this.client.fax);
        this.clientForm.get('website').setValue(this.client.website);
        this.clientForm.get('note').setValue(this.client.note);
        this.clientForm.get('contactName').setValue(this.client.contactName);
        this.clientForm.get('contactEmail').setValue(this.client.contactEmail);
        this.clientForm.get('contactPhoneNumber').setValue(this.client.contactPhoneNumber);
        this.clientForm.get('defaultTravelMilesAmount').setValue(this.client.defaultTravelMilesAmount);

      this.addressForms = this.fb.array([]);

        this.client.Addresses.filter(a => a.isMain == false).forEach(a => {
          this.addressForms.push(
            this.fb.group({
              id: new FormControl(a.id) ,
              street: new FormControl(a.address1) ,
              street2: new FormControl(a.address2) ,
              zip: new FormControl(a.zip) ,
              city: new FormControl(a.city) ,
              state: new FormControl(a.state) ,
            })
          )
          this.stateGroupOptionsList.push(this.addressForms.controls[this.addressForms.controls.length-1].get('state')!.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterGroup(value))
          ))
        })

        this.mainProviderForm.get('idTitleProvider').setValue(this.client.MainProvider.TitleStudent == undefined ? 0 : this.client.MainProvider.TitleStudent.id);
        this.mainProviderForm.get('firstName').setValue(this.client.MainProvider.firstName);
        this.mainProviderForm.get('lastName').setValue(this.client.MainProvider.lastName);
        this.mainProviderForm.get('suffix').setValue(this.client.MainProvider.suffix);
        this.mainProviderForm.get('email').setValue(this.client.MainProvider.email);
        this.mainProviderForm.get('phoneNumber').setValue(this.client.MainProvider.phoneNumber);
        this.mainProviderForm.get('dea').setValue(this.client.MainProvider.DEA);
        this.mainProviderForm.get('stateBoardLicense').setValue(this.client.MainProvider.stateBoardLicense);

        this.dataSource.paginator = this.paginator;
      }
    )
    this.clientService.emitClientSubject();

    this.clientService.getTypeClients();

    this.TypeClientsSubscription = this.clientService.TypeClientsListSubject.subscribe(
      (ClientTypes : ClientType[]) => {
        this.ClientTypes = ClientTypes;
        this.filteredTypeClients.next(this.ClientTypes.slice());
      }
    )
    this.clientService.emitTypeClientsListSubject();

    this.TypeClientsFilterCtrl.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterClientTypes();
    });

    this.clientService.getTitleProviders();
    this.TitleStudentsSubscription = this.clientService.TitleStudentsListSubject.subscribe(
      (TitleStudents : TitleStudent[]) => {
        this.TitleStudents = TitleStudents;
      }
    )
    this.clientService.emitTitleStudentsListSubject();

    this.stateGroupOptions = this.clientForm.get('state')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
    );
   }

  ngAfterViewInit (){
  }

  async onUpdateClient(){
    const name = this.clientForm.get('name').value;
    const description = this.clientForm.get('description').value;
    const street = this.clientForm.get('street').value;
    const street2 = this.clientForm.get('street2').value;
    const zip = this.clientForm.get('zip').value;
    const city = this.clientForm.get('city').value;
    const state = this.clientForm.get('state').value;
    const email = this.clientForm.get('email').value;
    const phoneNumber = this.clientForm.get('phoneNumber').value;
    const cellNumber = this.clientForm.get('phoneNumber').value;
    const fax = this.clientForm.get('fax').value;
    const website = this.clientForm.get('website').value;
    const note = this.clientForm.get('note').value;
    const contactName = this.clientForm.get('contactName').value;
    const contactEmail = this.clientForm.get('contactEmail').value;
    const contactPhoneNumber = this.clientForm.get('contactPhoneNumber').value;
    const defaultTravelMilesAmount = this.clientForm.get('defaultTravelMilesAmount').value;

    this.client.name = name;
    this.client.description = description;
    this.client.email = email;
    this.client.phoneNumber = phoneNumber;
    this.client.note = note;
    if( this.client.Addresses.filter(a => a.isMain).length > 0){
      this.client.Addresses.find(a => a.isMain).address1 = street
      this.client.Addresses.find(a => a.isMain).address2 = street2
      this.client.Addresses.find(a => a.isMain).zip = zip
      this.client.Addresses.find(a => a.isMain).city = city
      this.client.Addresses.find(a => a.isMain).state = state
    }
    else{
      let a = new Address();
      a.address1 = street;
      a.address2 = street2;
      a.city = city;
      a.state = state;
      a.zip = zip;
      a.isMain = true;
      this.client.Addresses.push(a);
    }

    this.client.cellNumber = cellNumber;
    this.client.fax = fax;
    this.client.website = website;
    this.client.contactName = contactName;
    this.client.contactEmail = contactEmail;
    this.client.contactPhoneNumber = contactPhoneNumber;
    this.client.defaultTravelMilesAmount = Number(defaultTravelMilesAmount);
    this.clientService.updateClient(this.client).then(
      (result : any) => {

      }
    );
    this._snackBar.open('The Client ' + this.client.name + ' has been updated', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  onUpdateAddresses(){
    let Addresses = new Array<Address>();
    for (let control of this.addressForms.controls) {
      const id = control.get('id').value;
      const street = control.get('street').value;
      const street2 = control.get('street2').value;
      const zip = control.get('zip').value;
      const city = control.get('city').value;
      const state = control.get('state').value;

      let a = new Address();
      a.id = id;
      a.address1 = street;
      a.address2 = street2;
      a.zip = zip;
      a.city = city;
      a.state = state;
      a.Client = new Client();
      a.Client.id = this.client.id;
      Addresses.push(a);
    }

    this.clientService.updateAddresses(Addresses).then(
      (result : any) => {
        this._snackBar.open('The Addresses have been updated', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    );
  }

  onUpdateMainProvider(){
    let firstName = this.mainProviderForm.get("firstName").value
    let lastName = this.mainProviderForm.get("lastName").value
    let suffix = this.mainProviderForm.get("suffix").value
    let email = this.mainProviderForm.get("email").value
    let phoneNumber = this.mainProviderForm.get("phoneNumber").value
    let stateBoardLicense = this.mainProviderForm.get("stateBoardLicense").value
    let dea = this.mainProviderForm.get("dea").value
    let idTitleStudent = this.mainProviderForm.get("idTitleProvider").value;

    let s = new Student();
    s.id = this.client.MainProvider.id;
    s.lastName = lastName;
    s.firstName = firstName;
    s.email = s.email;
    s.phoneNumber = phoneNumber;
    s.DEA = dea;
    s.suffix = suffix;
    s.email = email;
    s.isMainProvider = true;
    s.stateBoardLicense = stateBoardLicense
    s.TitleStudent = new TitleStudent();
    s.TitleStudent.id = idTitleStudent;
    s.TypeStudent = new TypeStudent();
    s.TypeStudent.id = this.client.MainProvider.TypeStudent.id;
    this.clientService.updateStudent(s).then(
      async (res) => {
        await this.clientService.getClient(this.client.id);
        this.clientService.emitClientSubject();
        this._snackBar.open('The Main Provider has been updated', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
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

  getErrorMessage() {
    if (this.clientForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }
    return this.clientForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  isMainProvider(id : number){
    let student : Student = this.client.Students.find(s => s.id == id);
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

  onDisplayAddress(){
    this.displayAddress = this.displayAddress?false:true;
  }

  filterClientTypes(){
    if (!this.ClientTypes) {
      return;
    }
    let search = this.TypeClientsFilterCtrl.value;
    if (!search) {
      this.filteredTypeClients.next(this.ClientTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTypeClients.next(
      this.ClientTypes.filter(clientype => clientype.name.toLowerCase().indexOf(search) > -1)
    );
  }

  fileChange(evt: any){
    this.file = <DataTransfer>(evt.target);
    this.fileName = this.file.files[0].name;
    console.log(this.fileName)
  }

  ImportStudent(evt: any){
    const target: DataTransfer = <DataTransfer>(this.file);
    const reader: FileReader = new FileReader();
    let Students: Array<Student> = new Array<Student>();
    reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        let fileData = (XLSX.utils.sheet_to_json(ws, {header: 0}));

        console.log(fileData)

        fileData.forEach(d => {
          let s = new Student();
          s.firstName = d['firstName'];
          s.lastName = d['lastName'];
          s.suffix = d['suffix'];
          s.email = d['email'];
          s.phoneNumber = d['phoneNumber'];
          s.stateBoardLicense = d['stateBoardLicense'];
          s.DEA = d['DEA'];
          s.enable = true;
          let typeS = new TypeStudent()
          typeS.id = 2;
          let titleS = new TypeStudent()
          titleS.id = 2;
          s.TypeStudent = typeS;
          s.TitleStudent = titleS;
          s.Client = this.client;
          Students.push(s)
        })
        console.log(Students)
        this.clientService.addStudents(Students)
    }
    reader.readAsBinaryString(target.files[0]);

  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-delete-student-dialog.html',
})
export class DialogDeleteStudent {

  constructor(
    private ClientService : ClientService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogDeleteStudent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

    deleteStudent(id:number): void {
      this.ClientService.deleteStudent(id).then(res => {
        this.dialogRef.close();

      });

  }

}
