import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                this.authService
                    .signInWithAccessToken()
                    .subscribe({
                        next: ({ user }) => {
                            if (user.isAdmin) {
                                resolve(true);
                            } else {
                                this.authService.error = 'You must be an admin to access this page';
                                this.router.navigate(['/sign-in']);
                                reject(false);
                            }
                        },
                        error: () => {
                            this.router.navigate(['/sign-in']);
                            reject(false);
                        }
                    });
            } else {
                this.authService.error = 'You must be signed in to access this page.';
                this.router.navigate(['/sign-in']);
                reject(false);
            }
        });
    }
}
