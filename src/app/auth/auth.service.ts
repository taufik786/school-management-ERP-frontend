import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

const apiUrl = 'http://127.0.0.1:5000/api/v1/login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: any;
  private tokenTimer: any;
  public loggedInUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loggedInUser.asObservable();
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  login(authData: AuthData) {
    this.http.post<AuthData>(apiUrl, authData).subscribe({
      next: (response: any) => {
        const token = response.token;
        this.token = token;
        this.setAuthTimer(3600);
        this.isAuthenticated = true;
        this.loggedInUser.next(response.data);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 3600 * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, response.data);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.loggedInUser.next(null);
        console.error(e);
      },
      complete: () => console.info('complete'),
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.loggedInUser.next(authInformation.userData);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.loggedInUser.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userData: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userData');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userData = JSON.parse(localStorage.getItem('userData') as string);
    if (!token || !expirationDate || !userData) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userData: userData,
    };
  }
}
