import { Component, OnInit } from '@angular/core';
import { NotificationsService } from "./shared/notifications/notifications.service";
import { NotificationsDto } from "@superstore/libs";
import { AuthService } from "./auth/auth.service";

@Component({
    selector: 'superstore-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    static displayResponsiveMenu = false;
    notificationMessage: NotificationsDto;

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        // Check for access token
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            this.authService.signInWithAccessToken().subscribe();
        }

        window.addEventListener('resize', () => {
            AppComponent.displayResponsiveMenu = window.innerWidth < 768;
        });

        // Listen for notifications
        this.notificationsService
            .message
            .subscribe((message) => this.notificationMessage = message);
    }

    get displayResponsiveMenu(): boolean {
        return AppComponent.displayResponsiveMenu;
    }
}
