import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { NotificationsService } from "../shared/notifications/notifications.service";
import { NotificationType } from "@superstore/libs";

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

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise((resolve, reject) => {
            if (this.authService.user) {
                resolve(true);
            } else {
                this.notificationsService.message
                    .emit({
                        icon: 'error' as NotificationType,
                        title: 'Unauthorized',
                        description: 'You must be logged in to access this page.',
                        show: true
                    });
                this.router.navigate(['/sign-in']);
                reject(false);
            }
        });
    }
}
