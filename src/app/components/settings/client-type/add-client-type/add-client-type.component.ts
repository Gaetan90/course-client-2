import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from '../../../../services/settings.service';
import { ClientService } from '../../../../services/client.service';
import { ClientType } from '../../../../models/ClientType';

@Component({
  selector: 'app-add-client-type',
  templateUrl: './add-client-type.component.html',
  styleUrls: ['./add-client-type.component.css']
})
export class AddClientTypeComponent implements OnInit {

  ClientTypeForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  })
  
  constructor(
    private ClientService: ClientService,
    private SettingsService : SettingsService
  ) { }

  ngOnInit(): void {
  }

  onAddClientType(){
    let clientType = new ClientType();
    clientType.name = this.ClientTypeForm.get('name').value;
    clientType.description = this.ClientTypeForm.get('description').value;
    clientType.enable = true;
    this.SettingsService.addClientType(clientType).then((res : ClientType) => {
      this.ClientService.ClientTypes.push(res);
      this.ClientService.emitTypeClientsListSubject();
    })

  }

}
