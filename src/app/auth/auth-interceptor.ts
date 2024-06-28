import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Access token might be expired, try to refresh it using the refresh token
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              const newAccessToken = this.authService.getAccessToken();
              if (newAccessToken) {
                const newAuthReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newAccessToken}` }
                });
                return next.handle(newAuthReq);
              }
              return throwError(() => new Error('Failed to refresh access token'));
            }),
            catchError(err => {
              // If refreshing the access token fails, log the user out or handle accordingly
              return throwError(err);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
