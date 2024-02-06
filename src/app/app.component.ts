import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/User';
import { AuthService } from '../app/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'courses-client';

  currentUser : User = this.AuthService.currentUserValue;

  constructor(public router: Router, private AuthService: AuthService){
    localStorage.setItem('browser', (window.navigator.userAgent.toString().split('/')[window.navigator.userAgent.toString().split('/').length-2].split(' ')[1]));
    AuthService.currentUser.subscribe(user => this.changeUser(user))
  }

  logout() {
    this.AuthService.logout();
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
  private changeUser(user: User): void {
    this.currentUser = user;
  }
}
