import { Component, Input } from '@angular/core';
import { NotificationsDto, NotificationType } from "@superstore/libs";
import { NotificationsService } from "./notifications.service";

@Component({
    selector: 'superstore-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {

    @Input() message = {
        title: '',
        description: '',
        show: false
    } as NotificationsDto;

    constructor(
        private readonly notificationsService: NotificationsService,
    ) {
        this.hideNotificationAfterDelay();
    }

    hideNotification() {
        this.message.show = false;
    }

    hideNotificationAfterDelay() {
        setTimeout(() => {
            this.notificationsService.message.next({
                icon: 'success' as NotificationType,
                title: '',
                description: '',
                show: false,
            })
        }, 5000);
    }
}
