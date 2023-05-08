import { Component, Input } from '@angular/core';
import { NotificationsDto } from "@superstore/libs";

@Component({
    selector: 'superstore-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {

    @Input() message = {
        title: '',
        description: '',
        orderCompleted: false
    } as NotificationsDto;

    showNotification = true;

    constructor() {
        this.hideNotificationAfterDelay();
    }

    hideNotificationAfterDelay() {
        setTimeout(() => {
            this.showNotification = false;
        }, 5000);
    }
}
