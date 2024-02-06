import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../../models/User';
import { SettingsService } from '../../../../services/settings.service';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  @Input() User: User;

  currentUser: User;

  UserForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    userName: new FormControl(''),
    email: new FormControl(''),
    isAdmin: new FormControl(''),
    enable: new FormControl(''),
  })

  constructor(
    private SettingsService : SettingsService,
    private AuthService : AuthService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.UserForm = new FormGroup({
      firstName: new FormControl(this.User.firstName),
      lastName: new FormControl(this.User.lastName),
      userName: new FormControl(this.User.userName),
      email: new FormControl(this.User.email, [Validators.email]),
      isAdmin: new FormControl(this.User.isAdmin),
      enable: new FormControl(this.User.enable),
    })
    this.currentUser = this.AuthService.currentUserValue;
  }

  onUpdateUser(){
    this.User.firstName = this.UserForm.get('firstName').value;
    this.User.lastName = this.UserForm.get('lastName').value;
    this.User.isAdmin = this.UserForm.get('isAdmin').value ?? false;
    this.User.enable = this.UserForm.get('enable').value;
    this.User.email = this.UserForm.get('email').value;
    this.User.userName = this.UserForm.get('userName').value;
    this.SettingsService.updateUser(this.User).then((res : User) => {
      this.SettingsService.emitUsersSubject();
      this._snackBar.open('The User ' + this.User.firstName + ' ' + this.User.lastName + ' has bees updated', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    })
  }

}
