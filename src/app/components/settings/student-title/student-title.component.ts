import { Component, OnInit, Input } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { TitleStudent } from '../../../models/TitleStudent';

@Component({
  selector: 'app-student-title',
  templateUrl: './student-title.component.html',
  styleUrls: ['./student-title.component.css']
})
export class StudentTitleComponent implements OnInit {

  _name:string;

  TitleStudentsSubscription : Subscription;

  TitleStudents: TitleStudent[];

  constructor(
    private ClientService : ClientService
  ) { }

  ngOnInit(): void {
    this.ClientService.getTitleProviders();

    this.TitleStudentsSubscription = this.ClientService.TitleStudentsListSubject.subscribe(
      (TitleStudents : TitleStudent[]) => {
        this.TitleStudents = TitleStudents;
      }
    ) 
    this.ClientService.emitTitleStudentsListSubject(); 
  }

  @Input()
  set TitleStudent_filter(name: string) {
    if(name === ''){
      this.ClientService.emitTitleStudentsListSubject();
    }else{
      this.TitleStudents = this.ClientService.TitleStudents.filter(cc => cc.name.toUpperCase().includes(name.toUpperCase()))
    }
  }

  get TitleStudent_filter(): string { return this._name; }

}
