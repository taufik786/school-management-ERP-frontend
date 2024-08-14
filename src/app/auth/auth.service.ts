import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthData } from './auth-data.model';

const apiUrl = 'http://127.0.0.1:5000/api/v1/login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private accessToken: any;
  private refreshToken: any;
  private tokenTimer: any;
  public loggedInUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loggedInUser.asObservable();
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  login(authData: AuthData) {
    this.http.post<AuthData>(apiUrl, authData).subscribe({
      next: (res: any) => {
        console.log(res, 'resss');
        this.accessToken = res.accessToken;
        this.refreshToken = res.refreshToken;
        this.isAuthenticated = true;
        this.loggedInUser.next(res.data);
        const tokenExpirationDate = new Date(
          new Date().getTime() + res.tokenExpiresIn
        );
        this.tokenTimer = tokenExpirationDate;
        this.saveAuthData(
          res.accessToken,
          res.refreshToken,
          tokenExpirationDate,
          res.data
        );
        this.autoRenewAccessToken();
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
    this.accessToken = authInformation.accessToken;
    this.refreshToken = authInformation.refreshToken;
    this.tokenTimer = authInformation.tokenExpirationDate;
    this.isAuthenticated = true;
    this.loggedInUser.next(authInformation.userData);
    this.autoRenewAccessToken();
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenTimer = null;
    this.isAuthenticated = false;
    this.loggedInUser.next(null);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private saveAuthData(
    accessToken: string,
    refreshToken: string,
    tokenExpirationDate: Date,
    userData: any
  ) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem(
      'tokenExpirationDate',
      tokenExpirationDate.toISOString()
    );
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  private clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpirationDate');
  }

  private getAuthData() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    const userData = JSON.parse(localStorage.getItem('userData') as string);
    if (!accessToken || !refreshToken || !tokenExpirationDate || !userData) {
      return;
    }
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenExpirationDate: new Date(tokenExpirationDate),
      userData: userData,
    };
  }

  autoRenewAccessToken() {
    const tokenTime = new Date(this.tokenTimer).getTime();
    const currentTime = new Date().getTime();
    const delay = tokenTime - currentTime;

    setTimeout(() => {
      this.http
        .post<any>('http://127.0.0.1:5000/api/v1/refreshToken', {
          refreshToken: this.refreshToken,
        })
        .subscribe({
          next: (res: any) => {
            this.accessToken = res.accessToken;
            this.refreshToken = res.refreshToken;
            this.isAuthenticated = true;
            this.loggedInUser.next(res.data);
            const tokenExpirationDate = new Date(
              new Date().getTime() + res.tokenExpiresIn
            );
            this.tokenTimer = tokenExpirationDate;
            this.saveAuthData(
              res.accessToken,
              res.refreshToken,
              tokenExpirationDate,
              res.data
            );
            this.autoAuthUser();
          },
          error: (err:any)=>{
            this.logout()
          }
        });
    }, delay);
  }
}
