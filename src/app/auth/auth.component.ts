import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  email: string;
  password: string;

  constructor(public authService: AuthService) {}

  signupWithEmail() {
    this.authService.signupWithEmail(this.email, this.password);
    this.email = this.password = '';
  }

  loginWithEmail() {
    this.authService.loginWithEmail(this.email, this.password);
    this.email = this.password = '';    
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
    this.email = this.password = '';    
  }

  logout() {
    this.authService.logout();
  }
}


