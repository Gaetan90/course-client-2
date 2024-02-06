import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { TeachingMode } from '../../../models/TeachingMode';

@Component({
  selector: 'app-teaching-mode',
  templateUrl: './teaching-mode.component.html',
  styleUrls: ['./teaching-mode.component.css']
})
export class TeachingModeComponent implements OnInit {

  _name:string;

  TeachingModeSubscription : Subscription;

  TeachingModes: TeachingMode[];

  constructor(
    private CourseService: CourseService
  ) { }

  ngOnInit(): void {
    this.CourseService.getTeachingModes();

    this.TeachingModeSubscription = this.CourseService.TeachingModesSubject.subscribe(
      (TeachingModes : TeachingMode[]) => {
        this.TeachingModes = TeachingModes;
      }
    ) 
    this.CourseService.emitTeachingModesSubject(); 
  }

  @Input()
  set TeachingMode_filter(name: string) {
    if(name === ''){
      this.CourseService.emitTeachingModesSubject();
    }else{
      this.TeachingModes = this.CourseService.TeachingModes.filter(cc => cc.name.toUpperCase().includes(name.toUpperCase()))
    }
  }

  get CourseCategory_filter(): string { return this._name; }

}
