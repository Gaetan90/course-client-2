import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../../../models/User';
import { SettingsService } from '../../../../services/settings.service';
import { MustMatch } from '../../../../Pipes/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  User: User;

  resetPasswordForm: FormGroup;
  

  id:number | any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private SettingsService : SettingsService
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.resetPasswordForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      }, {
        validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    let password = this.resetPasswordForm.get('password').value;


    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
        return;
    }

    this.SettingsService.resetPassword(this.id, password)
        .then(
            (user : User) => {
              this.router.navigate(['/settings/users']);
            },
            error => {
            });
}

}
