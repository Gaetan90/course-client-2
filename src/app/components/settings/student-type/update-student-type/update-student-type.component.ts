import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';
import { ClientService } from '../../../../services/client.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeStudent } from '../../../../models/TypeStudent';

@Component({
  selector: 'app-update-student-type',
  templateUrl: './update-student-type.component.html',
  styleUrls: ['./update-student-type.component.css']
})
export class UpdateStudentTypeComponent implements OnInit {

  @Input() TypeStudent: TypeStudent;

  StudentTypeForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    enable: new FormControl(''),
  })

  constructor(
    private ClientService: ClientService,
    private SettingsService : SettingsService,
    private _snackBar: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.StudentTypeForm = new FormGroup({
      name: new FormControl(this.TypeStudent.name),
      description: new FormControl(this.TypeStudent.description),
      enable: new FormControl(this.TypeStudent.enable),
    })
  }

  onUpdateStudentType(){
    this.TypeStudent.name = this.StudentTypeForm.get('name').value;
    this.TypeStudent.description = this.StudentTypeForm.get('description').value;
    this.TypeStudent.enable = this.StudentTypeForm.get('enable').value;
    this.SettingsService.updateTypeStudent(this.TypeStudent).then((res : TypeStudent) => {
      this.ClientService.emitTypeStudentsListSubject();
      this._snackBar.open('The Student Type ' + this.TypeStudent.name + ' has bees updated', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    })
  }

}
