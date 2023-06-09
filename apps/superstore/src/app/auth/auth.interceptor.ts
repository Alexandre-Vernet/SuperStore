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
        const token = localStorage.getItem('accessToken');
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${ token }`
                }
            });
        }
        return next.handle(request)
            .pipe(
                catchError((err) => {
                        if (err.status === 401) {
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            this.router.navigate(['/sign-in'])
                        }
                        throw err;
                    }
                ));
    }
}
