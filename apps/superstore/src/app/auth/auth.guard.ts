import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {

    constructor(
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            if (this.authService.user) {
                resolve(true);
            } else {
                this.router.navigate(['/sign-in']);
                reject(false);
            }
        });
    }
}
