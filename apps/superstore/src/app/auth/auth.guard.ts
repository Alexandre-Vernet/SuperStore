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
        private router: Router,
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            // Check for access token
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                this.authService
                    .signInWithAccessToken()
                    .subscribe({
                        next: () => resolve(true),
                        error: (err) => {
                            this.authService.error = err.error.message;
                            this.router.navigate(['/auth/sign-in']);
                            reject(false);
                        }
                    });
            } else {
                this.authService.error = 'You must be signed in to access this page.';
                this.router.navigate(['/auth/sign-in']);
                reject(false);
            }
        });
    }
}
