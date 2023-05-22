import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../auth/auth.service";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard {

    constructor(
        private authService: AuthService,
        private readonly notificationsService: NotificationsService,
        private router: Router,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                this.authService
                    .signInWithAccessToken()
                    .subscribe({
                        next: ({ user }) => {
                            if (user.isAdmin) {
                                resolve(true);
                            }
                            console.warn('Unauthorized')
                            this.notificationsService.showErrorNotification('Unauthorized', 'You must be an admin to access this page.');
                            this.router.navigateByUrl('/');
                            reject(false);
                        },
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
