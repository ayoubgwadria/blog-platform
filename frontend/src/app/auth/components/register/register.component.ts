import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss',
    '../../auth.component.scss']
  
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register({ email: this.email, password: this.password }).subscribe(
      () => this.router.navigate(['/login']),
      err => alert('Registration failed')
    );
  }
}
