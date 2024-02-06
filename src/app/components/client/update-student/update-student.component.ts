import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeStudent } from '../../../models/TypeStudent';
import { TitleStudent } from '../../../models/TitleStudent';
import { Client } from '../../../models/Client';
import { Student } from '../../../models/Student';

@Component({
  selector: 'app-update-student',
  templateUrl: './update-student.component.html',
  styleUrls: ['./update-student.component.css']
})
export class UpdateStudentComponent implements OnInit {

  id:number | any;

  client : Client;

  Student : Student;

  TitleStudents: TitleStudent[];

  TypeStudents: TypeStudent[];

  StudentForm:FormGroup;

  constructor(
    public  clientService : ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.client = this.clientService.client;
    this.Student = this.client.Students.filter((Student) =>  Student.id == this.id)[0];
    this.TitleStudents = this.clientService.TitleStudents.filter(ts => ts.enable);
    this.TypeStudents = this.clientService.TypeStudents.filter(ts => ts.enable);

    this.StudentForm = new FormGroup({
      firstName: new FormControl(this.Student.firstName),
      lastName: new FormControl(this.Student.lastName),
      email: new FormControl(this.Student.email, [Validators.email]),
      phoneNumber : new FormControl(this.Student.phoneNumber),
      idTitleStudent: new FormControl(this.Student.TitleStudent.id),
      idTypeStudent: new FormControl(this.Student.TypeStudent.id),
      newsletter: new FormControl(this.Student.newsletter),
      stateBoardLicense: new FormControl(this.Student.stateBoardLicense),
      dea: new FormControl(this.Student.DEA),
      isOSHACoordinator: new FormControl(this.Student.isOSHACoordinator),
      isPrivacySecurityOfficer: new FormControl(this.Student.isPrivacySecurityOfficer),
    });
  }

  onUpdateStudent(){
    let firstName = this.StudentForm.get("firstName").value
    let lastName = this.StudentForm.get("lastName").value
    let email = this.StudentForm.get("email").value
    let phoneNumber = this.StudentForm.get("phoneNumber").value
    let idTitleStudent = this.StudentForm.get("idTitleStudent").value
    let idTypeStudent = this.StudentForm.get("idTypeStudent").value
    let stateBoardLicense = this.StudentForm.get('stateBoardLicense').value;
    let dea = this.StudentForm.get('dea').value;
    let isOSHACoordinator = this.StudentForm.get('isOSHACoordinator').value;
    let isPrivacySecurityOfficer = this.StudentForm.get('isPrivacySecurityOfficer').value;
    let newsletter = this.StudentForm.get('newsletter').value;

    let s = new Student();
    s.id = this.Student.id;
    s.lastName = lastName;
    s.firstName = firstName;
    s.email = email;
    s.phoneNumber = phoneNumber;
    s.newsletter = newsletter;
    s.stateBoardLicense = stateBoardLicense;
    s.DEA = dea;
    s.isMainProvider = this.Student.isMainProvider;
    s.isOSHACoordinator = isOSHACoordinator;
    s.isPrivacySecurityOfficer = isPrivacySecurityOfficer
    s.TitleStudent = new TitleStudent();
    s.TitleStudent.id = idTitleStudent;
    s.TypeStudent = new TypeStudent();
    s.TypeStudent.id = idTypeStudent;
;
    this.clientService.updateStudent(s).then(
      () => {        
        this.router.navigate(['/client', this.Student.Client.id]);
      }
    );
  }

  getErrorMessage() {
    if (this.StudentForm.get('email').hasError('required')) {
      return 'You must enter a value';
    }

    return this.StudentForm.get('email').hasError('email') ? 'Not a valid email' : '';
  }
}
