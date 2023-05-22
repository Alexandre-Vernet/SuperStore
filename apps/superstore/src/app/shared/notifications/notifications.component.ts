import { Component, OnInit } from '@angular/core';
import { NotificationsDto } from "@superstore/libs";
import { NotificationsService } from "./notifications.service";

@Component({
    selector: 'superstore-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

    notificationMessage: NotificationsDto;

    constructor(
        private readonly notificationsService: NotificationsService,
    ) {
    }

    ngOnInit(): void {
        // Listen for notifications
        this.notificationsService
            .message
            .subscribe((message) => {
                this.notificationMessage = message;
                this.hideNotificationAfterDelay(message.duration);
            });
    }

    hideNotification() {
        this.notificationMessage.show = false;
    }

    hideNotificationAfterDelay(delay: number = 5000) {
        setTimeout(() => {
            this.notificationsService.hideNotification();
        }, delay);
    }
}
