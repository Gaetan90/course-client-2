import { Injectable } from '@angular/core';
import { CourseCategory } from '../models/CourseCategory';
import { HttpClient } from '@angular/common/http';
import { TeachingMode } from '../models/TeachingMode';
import { ClientType } from '../models/ClientType';
import { TypeStudent } from '../models/TypeStudent';
import { TitleStudent } from '../models/TitleStudent';
import { User } from '../models/User';
import { Subject } from 'rxjs';
import sha256 from 'crypto-js/sha256';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  UsersSubject = new Subject<User[]>();

  Users : User[]=[];

  urlApi: string;

  constructor(
    private httpClient : HttpClient
    ){
      this.urlApi = "https://cloudapi.msdssafety.com:3000";
  }

  emitUsersSubject(){
    this.UsersSubject.next(this.Users.slice())
  }

  getUsers(){
    this.httpClient
    .get<User[]>(this.urlApi + '/users')
    .subscribe(
        (response) => {
            this.Users = response;
            this.emitUsersSubject();
        },
        (error) => {
            console.log(error)
        }
    )
  }

  updateUser(User: User) {
    return this.httpClient.put(this.urlApi + '/updateuser/'+User.id, User).toPromise().then(res =>  res);
  }

  resetPassword(id: number, password: string) {
    console.log(User)
    password = sha256(password).toString();
    return this.httpClient.put(this.urlApi + '/resetpassword/'+id, password).toPromise().then(res =>  res);
  }

  register(User: User, password: string) {
    console.log(User)
    password = sha256(password).toString();
    return this.httpClient.post(this.urlApi + '/register', {user : User , password: password}).toPromise().then(res =>  res);
  }

  addCourseCategory(CourseCategory: CourseCategory) {
    return this.httpClient.post(this.urlApi + '/addcoursecategorie', CourseCategory).toPromise().then(res =>  res);
  }

  updateCourseCategory(CourseCategory: CourseCategory) {
    return this.httpClient.put(this.urlApi + '/updatecoursecategorie/'+CourseCategory.id, CourseCategory).toPromise().then(res =>  res);
  }

  addTeachingMode(TeachingMode: TeachingMode) {
    return this.httpClient.post(this.urlApi + '/addteachingmode', TeachingMode).toPromise().then(res =>  res);
  }

  updateTeachingMode(TeachingMode: TeachingMode) {
    return this.httpClient.put(this.urlApi + '/updateteachingmode/'+TeachingMode.id, TeachingMode).toPromise().then(res =>  res);
  }

  addClientType(ClientType: ClientType) {
    return this.httpClient.post(this.urlApi + '/addclienttype', ClientType).toPromise().then(res =>  res);
  }

  updateClientType(ClientType: ClientType) {
    return this.httpClient.put(this.urlApi + '/updateclienttype/'+ClientType.id, ClientType).toPromise().then(res =>  res);
  }

  addTypeStudent(TypeStudent: TypeStudent) {
    return this.httpClient.post(this.urlApi + '/addstudenttype', TypeStudent).toPromise().then(res =>  res);
  }

  updateTypeStudent(TypeStudent: TypeStudent) {
    return this.httpClient.put(this.urlApi + '/updatestudenttype/'+TypeStudent.id, TypeStudent).toPromise().then(res =>  res);
  }

  addTitleStudent(TitleStudent: TitleStudent) {
    return this.httpClient.post(this.urlApi + '/addstudenttitle', TitleStudent).toPromise().then(res =>  res);
  }

  updateTitleStudent(TitleStudent: TitleStudent) {
    return this.httpClient.put(this.urlApi + '/updatestudenttitle/'+TitleStudent.id, TitleStudent).toPromise().then(res =>  res);
  }
}
