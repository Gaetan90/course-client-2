import { Component, OnInit, Host, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { states } from '../../../states.json';
import { Observable, Subscription, ReplaySubject, Subject } from 'rxjs';
import { startWith, map, takeUntil, take } from 'rxjs/operators';
import { Client } from '../../../models/Client.js';
import { ClientService } from '../../../services/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientType } from '../../../models/ClientType';
import { MatSelect } from '@angular/material/select';
import { Student } from '../../../models/Student';
import { TypeStudent } from '../../../models/TypeStudent';
import { TitleStudent } from '../../../models/TitleStudent';
import { Address } from '../../../models/Address';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {

  constructor(
    private clientService : ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  stateGroups: StateGroup[] = states;

  clientForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    street: new FormControl(''),
    street2: new FormControl(''),
    city: new FormControl(''),
    zip: new FormControl(''),
    state: new FormControl(''),
    email: new FormControl('', [Validators.email]),
    email2: new FormControl('', [ Validators.email]),
    phoneNumber : new FormControl(''),
    cellNumber: new FormControl(''),
    fax: new FormControl(''),
    website: new FormControl(''),
    contactName: new FormControl(''),
    contactEmail: new FormControl('', [Validators.email]),
    contactPhoneNumber: new FormControl(''),
    defaultTravelMilesAmount: new FormControl(2),
    note: new FormControl(''),

    /***Main Provider */
    idTitleProvider: new FormControl(''),
    firstNameMainProvider: new FormControl(''),
    lastNameMainProvider: new FormControl(''),
    suffixMainProvider: new FormControl(''),
    emailMainProvider: new FormControl(''),
    phoneNumberMainProvider: new FormControl(''),
    stateBoardLicense: new FormControl(''),
    DAE: new FormControl(''),

    idTypeClient: new FormControl(''),
  });

  stateGroupOptions: Observable<StateGroup[]>;

  ClientTypes: ClientType[] = [];

  TypeClientsSubscription : Subscription;

  public TypeClientsFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredTypeClients: ReplaySubject<ClientType[]> = new ReplaySubject<ClientType[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected onDestroy = new Subject<void>();

  TitleStudents: TitleStudent[] = new Array<TitleStudent>();

  TitleStudentsSubscription : Subscription;


  ngOnInit(): void {
    let idTitleProvider = null;   

    this.clientService.getTitleProviders();
    this.TitleStudentsSubscription = this.clientService.TitleStudentsListSubject.subscribe(
      (TitleStudents : TitleStudent[]) => {
        this.TitleStudents = TitleStudents.filter(ts => ts.enable);
        this.activatedRoute.queryParams.subscribe(params => {
          if(this.TitleStudents.length > 0){
            console.log(this.TitleStudents)
            idTitleProvider = this.TitleStudents.find(t => t.name.toUpperCase().includes(params['titleProvider'].toUpperCase())).id?? null;
          }
          
          this.clientForm = new FormGroup({
            name: new FormControl(params['name']),
            description: new FormControl(''),
            street: new FormControl(params['street']),
            street2: new FormControl(params['street2']),
            city: new FormControl(params['city']),
            zip: new FormControl(params['zip']),
            state: new FormControl(params['state']),
            email: new FormControl(params['email'], [Validators.email]),
            email2: new FormControl(params['email2'], [ Validators.email]),
            phoneNumber : new FormControl(params['phoneNumber']),
            cellNumber: new FormControl(params['cellNumber']),
            fax: new FormControl(params['fax']),
            website: new FormControl(params['website']),
            contactName: new FormControl(params['contactName']),
            contactEmail: new FormControl(params['contactEmail'], [Validators.email]),
            contactPhoneNumber: new FormControl(params['contactPhoneNumber']),
            defaultTravelMilesAmount: new FormControl(2),
            note: new FormControl(''),
        
            /***Main Provider */
            idTitleProvider: new FormControl(idTitleProvider),
            firstNameMainProvider: new FormControl(params['firstNameMainProvider']),
            lastNameMainProvider: new FormControl(params['lastNameMainProvider']),
            suffixMainProvider: new FormControl(params['suffixMainProvider']),
            emailMainProvider: new FormControl(params['emailMainProvider']),
            phoneNumberMainProvider: new FormControl(params['phoneNumberMainProvider']),
            stateBoardLicense: new FormControl(params['stateBoardLicense']),
            DAE: new FormControl(params['DAE']),
        
            idTypeClient: new FormControl(''),
          });
      
      });
      }
    )    
    this.clientService.emitTitleStudentsListSubject(); 

    

    this.stateGroupOptions = this.clientForm.get('state')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );

    this.clientService.getTypeClients();

    this.TypeClientsSubscription = this.clientService.TypeClientsListSubject.subscribe(
      (ClientTypes : ClientType[]) => {
        this.ClientTypes = ClientTypes.filter(ct => ct.enable);
        this.clientForm.get('idTypeClient').setValue(ClientTypes[10].id);
        this.filteredTypeClients.next(this.ClientTypes.slice());
      }
    ) 
    this.clientService.emitTypeClientsListSubject(); 

    this.TypeClientsFilterCtrl.valueChanges
    .pipe(takeUntil(this.onDestroy))
    .subscribe(() => {
      this.filterClientTypes();
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

  onAddClient(){
    const name = this.clientForm.get('name').value;
    const description = this.clientForm.get('description').value;
    const street = this.clientForm.get('street').value;
    const street2 = this.clientForm.get('street2').value;
    const city = this.clientForm.get('city').value;
    const zip = this.clientForm.get('zip').value;
    const state = this.clientForm.get('state').value;
    const email = this.clientForm.get('email').value;
    const email2 = this.clientForm.get('email2').value;
    const phoneNumber = this.clientForm.get('phoneNumber').value;
    const fax = this.clientForm.get('fax').value;
    const cellNumber = this.clientForm.get('cellNumber').value;
    const website = this.clientForm.get('website').value;
    const note = this.clientForm.get('note').value;
    const contactName = this.clientForm.get('contactName').value;
    const contactEmail = this.clientForm.get('contactEmail').value;
    const contactPhoneNumber = this.clientForm.get('contactPhoneNumber').value;
    const defaultTravelMilesAmount = this.clientForm.get('defaultTravelMilesAmount').value;

    const idTypeClient = this.clientForm.get('idTypeClient').value;

    const idTitleProvider = this.clientForm.get('idTitleProvider').value;
    const firstNameMainProvider = this.clientForm.get('firstNameMainProvider').value;
    const lastNameMainProvider = this.clientForm.get('lastNameMainProvider').value;
    const suffixMainProvider = this.clientForm.get('suffixMainProvider').value;
    const emailMainProvider = this.clientForm.get('emailMainProvider').value;
    const phoneNumberMainProvider = this.clientForm.get('phoneNumberMainProvider').value;
    const stateBoardLicense = this.clientForm.get('stateBoardLicense').value;
    const DAE = this.clientForm.get('DAE').value;


    const newClient = new Client();
    newClient.id = null;
    newClient.name = name;
    newClient.description = description;
    newClient.email = email;
    newClient.email2 = email2;  
    newClient.phoneNumber = phoneNumber;
    newClient.fax = fax;
    newClient.cellNumber = cellNumber;
    newClient.website = website;
    newClient.note = note;
    newClient.contactName = contactName;
    newClient.contactEmail = contactEmail;
    newClient.contactPhoneNumber = contactPhoneNumber;
    newClient.defaultTravelMilesAmount = defaultTravelMilesAmount;
    newClient.newsletter = false;
    newClient.ClientType = new ClientType();
    newClient.ClientType.id = idTypeClient;
    
    newClient.Students = new Array<Student>();
    let s = new Student();
    s.firstName = firstNameMainProvider;
    s.lastName = lastNameMainProvider;
    s.isPrivacySecurityOfficer = false;
    s.isOSHACoordinator = false;
    s.suffix = suffixMainProvider;
    s.email = emailMainProvider;
    s.phoneNumber = phoneNumberMainProvider;
    s.stateBoardLicense = stateBoardLicense;
    s.DEA = DAE;
    s.isMainProvider = true;
    s.newsletter = true
    s.TypeStudent = new TypeStudent();
    s.TitleStudent = new TitleStudent();
    s.TitleStudent.id = idTitleProvider;
    newClient.Students.push(s);

    newClient.Addresses = new Array<Address>(); 
    let a = new Address();
    a.address1 = street;
    a.address2 = street2;
    a.city = city;
    a.state = state;
    a.zip = zip;
    a.isMain = true;
    newClient.Addresses.push(a);

    this.clientService.addNewClient(newClient).then(
      (res: Client) => {
        this.router.navigate(['/client', res.id]);
      }
    );
  }

  protected setInitialValue() {
    this.filteredTypeClients
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: ClientType, b: ClientType) => a && b && a.id === b.id;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  getErrorMessage() {
    if (this.clientForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.clientForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

  filterClientTypes(){
    if (!this.ClientTypes) {
      return;
    }
    // get the search keyword
    let search = this.TypeClientsFilterCtrl.value;
    if (!search) {
      this.filteredTypeClients.next(this.ClientTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTypeClients.next(
      this.ClientTypes.filter(clientype => clientype.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
