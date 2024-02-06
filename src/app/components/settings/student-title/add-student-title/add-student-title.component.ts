import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from '../../../../services/settings.service';
import { ClientService } from '../../../../services/client.service';
import { TitleStudent } from '../../../../models/TitleStudent';

@Component({
  selector: 'app-add-student-title',
  templateUrl: './add-student-title.component.html',
  styleUrls: ['./add-student-title.component.css']
})
export class AddStudentTitleComponent implements OnInit {

  StudentTitleForm = new FormGroup({
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

  onAddStudentTitle(){
    let titleStudent = new TitleStudent();
    titleStudent.name = this.StudentTitleForm.get('name').value;
    titleStudent.description = this.StudentTitleForm.get('description').value;
    titleStudent.enable = true;
    this.SettingsService.addTitleStudent(titleStudent).then((res : TitleStudent) => {
      this.ClientService.TitleStudents.push(res);
      this.ClientService.emitTitleStudentsListSubject();
    })

  }

}
