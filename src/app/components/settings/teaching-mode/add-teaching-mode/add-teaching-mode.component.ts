import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from '../../../../services/settings.service';
import { CourseService } from '../../../../services/course.service';
import { TeachingMode } from '../../../../models/TeachingMode';

@Component({
  selector: 'app-add-teaching-mode',
  templateUrl: './add-teaching-mode.component.html',
  styleUrls: ['./add-teaching-mode.component.css']
})
export class AddTeachingModeComponent implements OnInit {

  TeachingModeForm = new FormGroup({
    name: new FormControl(''),
    isTravelMiles: new FormControl(true),
  })

  constructor(
    private CourseService: CourseService,
    private SettingsService : SettingsService
  ) { }

  ngOnInit(): void {
    
  }

  onAddTeachingMode(){
    let teachingMode = new TeachingMode();
    teachingMode.name = this.TeachingModeForm.get('name').value;
    teachingMode.isTravelMiles = this.TeachingModeForm.get('isTravelMiles').value;
    teachingMode.enable = true;
    this.SettingsService.addTeachingMode(teachingMode).then((res : TeachingMode) => {
      this.CourseService.TeachingModes.push(res);
      this.CourseService.emitTeachingModesSubject();
    })

  }

}
