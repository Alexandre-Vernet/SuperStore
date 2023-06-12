import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class OptionalAuthGuard {

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private readonly notificationsService: NotificationsService
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
                        error: () => {
                            this.notificationsService.showErrorNotification('Unauthorized', 'Your session has expired. Please log in again.');
                            this.router.navigate(['/sign-in']);
                            reject(false);
                        }
                    });
            }
        });
    }
}
