import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor as AngularHttpInterceptor
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements AngularHttpInterceptor {

    constructor(
        private router: Router
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // If route is /sign-in or /sign-up, do not add Authorization header
        // if (request.url.includes('/sign-in') || request.url.includes('/sign-up')) {
        //     return next.handle(request);
        // }
        //
        // const token = localStorage.getItem('accessToken');
        // if (token) {
        //     request = request.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${ token }`
        //         }
        //     });
        // }
        // return next.handle(request)
        //     .pipe(
        //         catchError((err) => {
        //                 if (err.status === 401) {
        //                     localStorage.removeItem('accessToken');
        //                     localStorage.removeItem('refreshToken');
        //                     this.router.navigate(['/sign-in'])
        //                 }
        //                 throw err;
        //             }
        //         ));
        return next.handle(request);

    }
}
