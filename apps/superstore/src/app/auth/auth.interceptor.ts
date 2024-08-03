import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor as AngularHttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements AngularHttpInterceptor {

    constructor(
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
        return next.handle(request);
    }
}
