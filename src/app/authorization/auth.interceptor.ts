import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public user: any = JSON.parse(localStorage.getItem("userData"));

  constructor(private router: Router, private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.router.url != '/login') {
      request = this.addToken(request, this.authService.getJwtToken());
    }
    if (this.user) {
      var token = this.user.tokenExpire + '000';
      if (+token < +new Date()) {
        Swal.fire(
          'Error !',
          'Token Expired.',
          'error'
        ).then(ok => {
          if (ok.isConfirmed) {
            window.location.href = '/#/login';
            window.location.reload();
          }
        })
        //location.reload();
        return;
      }
    }
    return next.handle(request).pipe(catchError(error => {
      // console.log("request=" + request.headers.get("Authorization"));
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // return this.handle401Error(request, next);
        // console.log("401");
        return throwError(error);
      } else {
        return throwError(error);
      }
    }));
  }


  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers
        .set('Authorization', 'Basic ' + token)
    });
  }


  private addToken2(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('px-auth-token', '')
    });
  }

}
