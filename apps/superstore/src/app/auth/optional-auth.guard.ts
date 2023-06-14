import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class OptionalAuthGuard {

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve) => {
            // Check for access token
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                this.authService
                    .signInWithAccessToken()
                    .subscribe({
                        next: () => resolve(true),
                        error: () => resolve(true)
                    });
            } else {
                resolve(true);
            }
        });
    }
}
