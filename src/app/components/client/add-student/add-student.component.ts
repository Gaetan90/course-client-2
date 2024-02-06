import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TitleStudent } from '../../../models/TitleStudent';
import { TypeStudent } from '../../../models/TypeStudent';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientDetailComponent } from '../client-detail/client-detail.component';
import { ClientService } from '../../../services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from '../../../models/Student';
import { Client } from '../../../models/Client';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  studentForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [ Validators.email]),
    phoneNumber : new FormControl(''),
    idTitleProvider: new FormControl(''),
    idTypeProvider: new FormControl(''),
    newsletter: new FormControl(true),
    stateBoardLicense: new FormControl(''),
    dea: new FormControl(''),
    isOSHACoordinator: new FormControl(false),
    isPrivacySecurityOfficer: new FormControl(false),
  });

  @Input() id:number | any;

  TitleStudents: TitleStudent[];

  TypeStudents: TypeStudent[];

  TitleStudentsSubscription : Subscription;

  TypeStudentsSubscription : Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private service : ClientService,
    @Inject(ClientDetailComponent) private parent: ClientDetailComponent
  ) { }

  ngOnInit(): void {
    this.service.getTitleProviders();
    this.TitleStudentsSubscription = this.service.TitleStudentsListSubject.subscribe(
      (TitleStudents : TitleStudent[]) => {
        this.TitleStudents = TitleStudents.filter(ts => ts.enable);
      }
    )
    this.service.getTypeProviders();

    this.TypeStudentsSubscription = this.service.TypeStudentsListSubject.subscribe(
      (TypeStudents : TypeStudent[]) => {
        this.TypeStudents = TypeStudents.filter(ts => ts.enable);
      }
    )
    this.service.emitTitleStudentsListSubject();

    this.service.emitTitleStudentsListSubject();

  }


  onAddProvider(){
    let firstName = this.studentForm.get('firstName').value;
    let lastName = this.studentForm.get('lastName').value;
    let email = this.studentForm.get('email').value;
    let phoneNumber = this.studentForm.get('phoneNumber').value;
    let stateBoardLicense = this.studentForm.get('stateBoardLicense').value;
    let dea = this.studentForm.get('dea').value;
    let isOSHACoordinator = this.studentForm.get('isOSHACoordinator').value;
    let isPrivacySecurityOfficer = this.studentForm.get('isPrivacySecurityOfficer').value;

    let idTitleProvider = this.studentForm.get('idTitleProvider').value;
    let idTypeProvider = this.studentForm.get('idTypeProvider').value;

    let newsletter = this.studentForm.get('newsletter').value;

    const newStudent = new Student();
    newStudent.id = null;
    newStudent.lastName = lastName;
    newStudent.firstName = firstName;
    newStudent.email = email;
    newStudent.phoneNumber = phoneNumber;
    newStudent.newsletter = newsletter;
    newStudent.stateBoardLicense = stateBoardLicense;
    newStudent.DEA = dea;
    newStudent.isMainProvider = false;
    newStudent.isOSHACoordinator = isOSHACoordinator;
    newStudent.isPrivacySecurityOfficer = isPrivacySecurityOfficer

    newStudent.Client = new Client();
    newStudent.Client.id = this.id;

    newStudent.TitleStudent = new TitleStudent();
    newStudent.TitleStudent.id = idTitleProvider;

    newStudent.TypeStudent = new TypeStudent();
    newStudent.TypeStudent.id = idTypeProvider;

    this.parent.clientService.addNewStudent(newStudent).then(
      () => {
        this.studentForm = new FormGroup({
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          email: new FormControl('', [Validators.email]),
          phoneNumber : new FormControl('',[Validators.pattern('[6-9]\\d{9}')]),
          idTitleProvider: new FormControl(''),
          idTypeProvider: new FormControl(''),
          newsletter: new FormControl(true),
          stateBoardLicense: new FormControl(''),
          dea: new FormControl(''),
          isOSHACoordinator: new FormControl(false),
          isPrivacySecurityOfficer: new FormControl(false),
        });

        this._snackBar.open('The Provider ' + newStudent.firstName + ' ' +  newStudent.lastName + ' has bees added to the client ' + this.parent.client.name, 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });

        this.service.getClient(this.id);
        this.service.emitClientSubject();
      }
    );

    //this.parent.clientService.emitClientSubject();



    //this.router.navigate(['/client/'+ this.id]);
  }

  getErrorMessage() {
    if (this.studentForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.studentForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }

}
