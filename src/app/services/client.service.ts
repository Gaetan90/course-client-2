
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/Client';
import { Subject, Observable } from 'rxjs';
import { Student } from '../models/Student';
import { TitleStudent } from '../models/TitleStudent';
import { TypeStudent } from '../models/TypeStudent';
import { ClientType } from '../models/ClientType';
import { Address } from '../models/Address';

@Injectable()
export class ClientService {

  urlApi :string;

  clientsListSubject = new Subject<Client[]>();

  clientSubject = new Subject<Client>();

  TitleStudentsListSubject = new Subject<TitleStudent[]>();

  TypeStudentsListSubject = new Subject<TypeStudent[]>();

  TypeClientsListSubject = new Subject<ClientType[]>();

  clients : Client[]=[];

  client : Client= new Client();

  TitleStudents: TitleStudent[] = [];

  TypeStudents: TypeStudent[] = [];

  ClientTypes: ClientType[] = [];

  constructor(
      private httpClient : HttpClient
      ){
        this.urlApi = "https://cloudapi.msdssafety.com:3000";
  }

  emitClientsListSubject(){
      this.clientsListSubject.next(this.clients.slice())
  }

  emitClientSubject(){
    this.clientSubject.next(this.client)
  }

  emitTitleStudentsListSubject(){
    this.TitleStudentsListSubject.next(this.TitleStudents.slice())
  }

  emitTypeStudentsListSubject(){
    this.TypeStudentsListSubject.next(this.TypeStudents.slice())
  }

  emitTypeClientsListSubject(){
    this.TypeClientsListSubject.next(this.ClientTypes.slice())
  }


  getAllClients(){
    console.log('/clients')
    console.log(this.urlApi)
    this.httpClient
    .get<Client[]>(this.urlApi + '/clients')
    .subscribe(
        (response) => {
            this.clients = response.filter(c => c.enable == true);
            this.clients.forEach(e => {
              e.MainAddress = e.Addresses.filter(a => a.isMain === true).length  == 0?new Address(): e.Addresses.find(a => a.isMain === true);
              //e.MainProvider = e.Students.filter(s => s.isMainProvider === true).length  == 0 ?new Student(): e.Students.find(s => s.isMainProvider === true);

            })
            this.emitClientsListSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  getClient(id : number){
    this.httpClient
    .get<Client>(this.urlApi + '/client/'+id)
    .subscribe(
        (response) => {
            this.client = response;
            this.client.MainAddress = this.client.Addresses.filter(a => a.isMain === true).length  == 0?new Address(): this.client.Addresses.find(a => a.isMain === true);
            this.client.MainProvider = this.client.Students.filter(s => s.isMainProvider === true).length  == 0 ?new Student(): this.client.Students.find(s => s.isMainProvider === true);

            this.emitClientSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  getTitleProviders(){
    this.httpClient
    .get<TitleStudent[]>(this.urlApi + '/studenttitles')
    .subscribe(
      (response) => {
          this.TitleStudents = response;
          this.emitTitleStudentsListSubject();
      },
      (error) => {
          console.log(error)
      }
    )
  }

  getTypeProviders(){
    this.httpClient
    .get<TypeStudent[]>(this.urlApi + '/studenttypes')
    .subscribe(
      (response) => {
          this.TypeStudents = response;
          this.emitTypeStudentsListSubject();
      },
      (error) => {
          console.log(error)
      }
    )
  }

  getTypeClients(){
    this.httpClient
    .get<ClientType[]>(this.urlApi + '/clienttypes')
    .subscribe(
      (response) => {
          this.ClientTypes = response;
          this.emitTypeClientsListSubject();
      },
      (error) => {
          console.log(error)
      }
    )
  }

  addNewClient(newClient: Client) {
      return this.httpClient.post(this.urlApi + '/addclient', newClient).toPromise().then(res =>  res);
  }

  updateClient(client: Client) {
    return new Promise(
      (resolve, reject) => {
      this.httpClient.put(this.urlApi + '/updateClient/'+client.id, client)
      .subscribe(
          () => {
            console.log('Enregistrement terminé !');
          },
          (error) => {
            console.log('Erreur ! : ' + error);
          }
        );
      }
    )
  }

  deleteClient(id: number) {
    return this.httpClient.delete(this.urlApi + '/deleteclient/'+id).toPromise().then(res =>  null);
  }

  addNewStudent(newStudent: Student) {
    return this.httpClient.post(this.urlApi + '/addstudent', newStudent).toPromise().then(res =>  null);
  }

  addStudents(Students: Array<Student>) {
    return this.httpClient.post(this.urlApi + '/addStudents', Students).toPromise().then(res =>  null);
  }

  updateStudent(s: Student) {
    return this.httpClient.put(this.urlApi + '/updateStudent/'+s.id, s).toPromise().then(res =>  null);

  }

  deleteStudent(id: number) {
    return this.httpClient.delete(this.urlApi + '/deletestudent/'+id).toPromise().then(res =>  null);

  }
  addNewAddress(address: Address) {
    return this.httpClient.post(this.urlApi + '/addaddress', address).toPromise().then(res =>  res);
  }
  updateAddresses(addresses: Array<Address>){
    return this.httpClient.put(this.urlApi + '/updateaddresses', addresses).toPromise().then(res =>  null);

  }

  getStaffMembers(){
    return this.httpClient
    .get<Student[]>(this.urlApi + '/students')
  }


}
