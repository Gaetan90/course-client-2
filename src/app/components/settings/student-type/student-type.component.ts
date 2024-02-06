import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientService } from '../../../services/client.service';
import { TypeStudent } from '../../../models/TypeStudent';

@Component({
  selector: 'app-student-type',
  templateUrl: './student-type.component.html',
  styleUrls: ['./student-type.component.css']
})
export class StudentTypeComponent implements OnInit {

  _name:string;

  TypeStudentsSubscription : Subscription;

  TypeStudents: TypeStudent[];
  
  constructor(
    private ClientService : ClientService
  ) { }

  ngOnInit(): void {
    this.ClientService.getTypeProviders();

    this.TypeStudentsSubscription = this.ClientService.TypeStudentsListSubject.subscribe(
      (TypeStudents : TypeStudent[]) => {
        this.TypeStudents = TypeStudents;
      }
    ) 
    this.ClientService.emitTypeStudentsListSubject(); 
  }

  @Input()
  set TypeStudent_filter(name: string) {
    if(name === ''){
      this.ClientService.emitTypeClientsListSubject();
    }else{
      this.TypeStudents = this.ClientService.TypeStudents.filter(cc => cc.name.toUpperCase().includes(name.toUpperCase()))
    }
  }

  get TypeStudent_filter(): string { return this._name; }

}
