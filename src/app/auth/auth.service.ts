import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, catchError, filter, take, tap, throwError } from 'rxjs';

import { AuthData } from './auth-data.model';

const apiUrl = 'http://127.0.0.1:5000/api/v1/login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private accessToken: any;
  private refreshToken: any;
  private tokenTimer: any;
  public loggedInUser = new BehaviorSubject<any>(null);

  private refreshingInProgress = false;
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


  constructor(private http: HttpClient, private router: Router) {
    this.loggedInUser.asObservable();
  }

  getAccessToken() {
    return this.accessToken;
  }
  getRefreshToken() {
    return this.refreshToken;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  login(authData: AuthData) {
    this.http.post<AuthData>(apiUrl, authData).subscribe({
      next: (response: any) => {
        console.log(response,"resss")
        const accessToken = response.accessToken;
        this.accessToken = accessToken;
        const refreshToken = response.refreshToken;
        this.refreshToken = refreshToken;
        // this.setAuthTimer(3600);
        this.isAuthenticated = true;
        this.loggedInUser.next(response.data);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 3600 * 1000);
        console.log(expirationDate);
        this.saveAuthData(accessToken,refreshToken, expirationDate, response.data);
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
      this.accessToken = authInformation.accessToken;
      this.refreshToken = authInformation.refreshToken;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.loggedInUser.next(authInformation.userData);
    }
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
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

  private saveAuthData(accessToken: string, refreshToken:string, expirationDate: Date, userData: any) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  private clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userData');
  }

  private getAuthData() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expirationDate = localStorage.getItem('expiration');
    const userData = JSON.parse(localStorage.getItem('userData') as string);
    if (!accessToken || !refreshToken || !expirationDate || !userData) {
      return;
    }
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expirationDate: new Date(expirationDate),
      userData: userData,
    };
  }
  refreshAccessToken(): Observable<any> {
    // if (this.refreshingInProgress) {
    //   return this.accessTokenSubject.pipe(
    //     filter(token => token !== null),
    //     take(1)
    //   );
    // } else {
    //   this.refreshingInProgress = true;
    return this.http.post<any>("http://127.0.0.1:5000/api/v1/refreshToken", { refreshToken: this.refreshToken })
      .pipe(
        tap(response => {
          this.accessToken = response.accessToken;
        }),
        // catchError(this.handleError)
        catchError(error => {
          this.refreshingInProgress = false;
            return throwError(() => new Error('Failed to refresh access token'));
        })
      );
    // }
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  autoRenewAccessToken(){
    // console.log(localStorage.getItem("tokenExpiresIn"),"this.tokenExpiresIn")
    setInterval(() => {
      this.http.post<any>("http://127.0.0.1:5000/api/v1/refreshToken", { refreshToken: this.refreshToken }).subscribe({
        next: (response: any) => {
          this.accessToken = response.accessToken;
          console.log(response,"ressssssss333")
        }
      })
    }, 10000);
  }
}
