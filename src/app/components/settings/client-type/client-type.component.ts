import { Component, OnInit, Input } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Subscription } from 'rxjs';
import { ClientType } from '../../../models/ClientType';

@Component({
  selector: 'app-client-type',
  templateUrl: './client-type.component.html',
  styleUrls: ['./client-type.component.css']
})
export class ClientTypeComponent implements OnInit {

  _name:string;

  ClientTypesSubscription : Subscription;

  ClientTypes: ClientType[];
  
  constructor(
    private ClientService : ClientService
  ) { }

  ngOnInit(): void {
    this.ClientService.getTypeClients();

    this.ClientTypesSubscription = this.ClientService.TypeClientsListSubject.subscribe(
      (ClientTypes : ClientType[]) => {
        this.ClientTypes = ClientTypes;
      }
    ) 
    this.ClientService.emitTypeClientsListSubject(); 
  }

  @Input()
  set ClientType_filter(name: string) {
    if(name === ''){
      this.ClientService.emitTypeClientsListSubject();
    }else{
      this.ClientTypes = this.ClientService.ClientTypes.filter(cc => cc.name.toUpperCase().includes(name.toUpperCase()))
    }
  }

  get ClientType_filter(): string { return this._name; }

}
