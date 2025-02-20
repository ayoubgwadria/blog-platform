import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoginPage: boolean = false;
  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/login';
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout(): void {
    this.authService.logout();
  }
}
