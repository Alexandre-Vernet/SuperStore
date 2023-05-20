import { Component, OnInit } from '@angular/core';
import { NotificationsDto } from "@superstore/libs";
import { NotificationsService } from "./shared/notifications/notifications.service";

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
    ) {
    }

    ngOnInit(): void {
        // Listen for notifications
        this.notificationsService
            .message
            .subscribe((message) => this.notificationMessage = message);
    }

    get displayResponsiveMenu(): boolean {
        return AppComponent.displayResponsiveMenu;
    }
}
