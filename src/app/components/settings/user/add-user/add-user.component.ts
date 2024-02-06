import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../../../services/settings.service';
import { MustMatch } from '../../../../Pipes/must-match.validator';
import { User } from '../../../../models/User';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  hideConfirm = true;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private SettingsService: SettingsService
  ) {}
  

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          userName: ['', [Validators.required]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, {
        validator: MustMatch('password', 'confirmPassword')
    });
    this.f['firstName'].valueChanges.subscribe((v) =>{
      this.f['userName'].setValue((this.f['firstName'].value + '.' + this.f['lastName'].value).toLowerCase() )
    })
    this.f['lastName'].valueChanges.subscribe((v) =>{
      this.f['userName'].setValue((this.f['firstName'].value + '.' + this.f['lastName'].value).toLowerCase() )
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;
      let user = new User();
      user.lastName = this.registerForm.get('lastName').value;
      user.firstName = this.registerForm.get('firstName').value;
      user.email = this.registerForm.get('email').value;
      user.userName = this.registerForm.get('userName').value;

      let password = this.registerForm.get('password').value;


      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }

      this.loading = true;
      this.SettingsService.register(user, password)
          .then(
              (user : User) => {
                this.SettingsService.Users.push(user);
                this.SettingsService.emitUsersSubject();
                this.registerForm.reset()
              },
              error => {
                  this.loading = false;
              });
  }
}
