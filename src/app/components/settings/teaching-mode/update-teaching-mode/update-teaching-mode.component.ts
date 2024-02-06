import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeachingMode } from '../../../../models/TeachingMode';
import { SettingsService } from '../../../../services/settings.service';
import { CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-update-teaching-mode',
  templateUrl: './update-teaching-mode.component.html',
  styleUrls: ['./update-teaching-mode.component.css']
})
export class UpdateTeachingModeComponent implements OnInit {

  @Input() TeachingMode: TeachingMode;

  TeachingModeForm = new FormGroup({
    name: new FormControl(''),
    enable: new FormControl(''),
    isTravelMiles: new FormControl(''),
  })

  constructor(
    private CourseService: CourseService,
    private SettingsService : SettingsService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.TeachingModeForm = new FormGroup({
      name: new FormControl(this.TeachingMode.name),
      enable: new FormControl(this.TeachingMode.enable),
      isTravelMiles: new FormControl(this.TeachingMode.isTravelMiles),
    })
  }

  onUpdateTeachingMode(){
    this.TeachingMode.name = this.TeachingModeForm.get('name').value;
    this.TeachingMode.enable = this.TeachingModeForm.get('enable').value;
    this.TeachingMode.isTravelMiles = this.TeachingModeForm.get('isTravelMiles').value;
    this.SettingsService.updateTeachingMode(this.TeachingMode).then((res : TeachingMode) => {
      this.CourseService.emitTeachingModesSubject();
      this._snackBar.open('The Teaching Mode ' + this.TeachingMode.name + ' has bees updated', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    })
  }

}
