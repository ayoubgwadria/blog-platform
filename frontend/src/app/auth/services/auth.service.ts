import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import { authGuard } from 'src/app/core/guards/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userSubject = new BehaviorSubject<any>(null);
  public user = this.userSubject.asObservable();
  
  constructor(private http: HttpClient, private router: Router , private authGuard:authGuard) {}

  register(user: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((tokens: any) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        return tokens;
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  logout(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.clearSession();
      return;
    }

    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }
  getCurrentUser():Observable<any>{
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const user = this.authGuard.decodeUserData(accessToken) as any;
      if (!user) {
        throw new Error('User data is null');
      }
      const userId = (user as any).userId;
      return this.http.get(`${this.apiUrl}/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    } else {
      throw new Error('Access token is null');
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }



  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
