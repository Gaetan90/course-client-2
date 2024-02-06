import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../services/settings.service';
import { User } from '../../../models/User';
import { AddUserComponent } from './add-user/add-user.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    
    _name:string;

    UserSubscription : Subscription;
  
    Users: User[];
  
    constructor(
      private SettingsService: SettingsService
    ) { }
  
    ngOnInit(): void {
      this.SettingsService.getUsers();
  
      this.UserSubscription = this.SettingsService.UsersSubject.subscribe(
        (Users : User[]) => {
          this.Users = Users;
        }
      ) 
      this.SettingsService.emitUsersSubject(); 
    }
  
    @Input()
    set User_filter(name: string) {
      if(name === ''){
        this.SettingsService.emitUsersSubject();
      }else{
        this.Users = this.SettingsService.Users.filter(cc => cc.email.toUpperCase().includes(name.toUpperCase()))
      }
    }
  

}
