import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/Client';
import { FormGroup, FormControl } from '@angular/forms';
import { StateGroup, _filter } from '../add-client/add-client.component';
import { Observable } from 'rxjs';
import { states } from '../../../states.json';
import { startWith, map } from 'rxjs/operators';
import { Address } from '../../../models/Address';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {

  client: Client;

  clientId:number | any;

  addressForm = new FormGroup({
    street: new FormControl(''),
    street2: new FormControl(''),
    zip: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
  });

  stateGroups: StateGroup[] = states;

  stateGroupOptions: Observable<StateGroup[]>;

  constructor(
    private ClientService : ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.client = this.ClientService.client;
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    this.stateGroupOptions = this.addressForm.get('state')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  onAddAddress(){
    const street = this.addressForm.get('street').value;
    const street2 = this.addressForm.get('street2').value;
    const zip = this.addressForm.get('zip').value;
    const city = this.addressForm.get('city').value;
    const state = this.addressForm.get('state').value;

    let address = new Address();
    address.address1=street;
    address.address2=street2;
    address.zip=zip;
    address.city=city;
    address.state=state;
    address.Client = new Client();
    address.Client.id = this.clientId;
    this.ClientService.addNewAddress(address).then(
      () => {        
        this.router.navigate(['/client', this.client.id]);
      }
    );
  }

}
