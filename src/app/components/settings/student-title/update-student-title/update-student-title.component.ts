import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';
import { ClientService } from '../../../../services/client.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleStudent } from '../../../../models/TitleStudent';

@Component({
  selector: 'app-update-student-title',
  templateUrl: './update-student-title.component.html',
  styleUrls: ['./update-student-title.component.css']
})
export class UpdateStudentTitleComponent implements OnInit {

  @Input() TitleStudent: TitleStudent;

  StudentTitleForm = new FormGroup({
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
    this.StudentTitleForm = new FormGroup({
      name: new FormControl(this.TitleStudent.name),
      description: new FormControl(this.TitleStudent.description),
      enable: new FormControl(this.TitleStudent.enable),
    })
  }

  onUpdateStudentTitle(){
    this.TitleStudent.name = this.StudentTitleForm.get('name').value;
    this.TitleStudent.description = this.StudentTitleForm.get('description').value;
    this.TitleStudent.enable = this.StudentTitleForm.get('enable').value;
    this.SettingsService.updateTitleStudent(this.TitleStudent).then((res : TitleStudent) => {
      this.ClientService.emitTypeStudentsListSubject();
      this._snackBar.open('The Medical Title ' + this.TitleStudent.name + ' has bees updated', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    })
  }

}
