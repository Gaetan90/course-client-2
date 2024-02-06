import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from '../../../../services/settings.service';
import { ClientService } from '../../../../services/client.service';
import { TypeStudent } from '../../../../models/TypeStudent';

@Component({
  selector: 'app-add-student-type',
  templateUrl: './add-student-type.component.html',
  styleUrls: ['./add-student-type.component.css']
})
export class AddStudentTypeComponent implements OnInit {

  StudentTypeForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    enable: new FormControl(''),
  })
  
  constructor(
    private ClientService: ClientService,
    private SettingsService : SettingsService,
    ) { }

    
  ngOnInit(): void {
  }

  onAddStudentType(){
    let typeStudent = new TypeStudent();
    typeStudent.name = this.StudentTypeForm.get('name').value;
    typeStudent.description = this.StudentTypeForm.get('description').value;
    typeStudent.enable = true;
    this.SettingsService.addTypeStudent(typeStudent).then((res : TypeStudent) => {
      this.ClientService.TypeStudents.push(res);
      this.ClientService.emitTypeClientsListSubject();
    })

  }

}
