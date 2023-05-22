import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private readonly notificationsService: NotificationsService
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            // Check for access token
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                this.authService
                    .signInWithAccessToken()
                    .subscribe({
                        next: () => resolve(true),
                        error: () => {
                            this.router.navigate(['/sign-in']);
                            reject(false);
                        }
                    });
            } else {
                this.notificationsService.showErrorNotification('Unauthorized', 'You must be logged in to access this page.');
                this.router.navigate(['/sign-in']);
                reject(false);
            }
        });
    }
}
