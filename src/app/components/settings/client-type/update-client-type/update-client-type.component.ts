import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../../../services/settings.service';
import { ClientService } from '../../../../services/client.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientType } from '../../../../models/ClientType';

@Component({
  selector: 'app-update-client-type',
  templateUrl: './update-client-type.component.html',
  styleUrls: ['./update-client-type.component.css']
})
export class UpdateClientTypeComponent implements OnInit {

  @Input() ClientType: ClientType;

  ClientTypeForm = new FormGroup({
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
    this.ClientTypeForm = new FormGroup({
      name: new FormControl(this.ClientType.name),
      description: new FormControl(this.ClientType.description),
      enable: new FormControl(this.ClientType.enable),
    })
  }

  onUpdateClientType(){
    this.ClientType.name = this.ClientTypeForm.get('name').value;
    this.ClientType.description = this.ClientTypeForm.get('description').value;
    this.ClientType.enable = this.ClientTypeForm.get('enable').value;
    this.SettingsService.updateClientType(this.ClientType).then((res : ClientType) => {
      this.ClientService.emitTypeClientsListSubject();
      this._snackBar.open('The Client Type ' + this.ClientType.name + ' has bees updated', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    })
  }

}
