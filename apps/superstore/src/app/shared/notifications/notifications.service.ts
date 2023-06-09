import { EventEmitter, Injectable } from '@angular/core';
import { NotificationsDto, NotificationType } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    message = new EventEmitter<NotificationsDto>();

    showSuccessNotification(title: string, description: string, duration: number = 5000) {
        this.message.emit({
            show: true,
            icon: 'success' as NotificationType,
            title,
            description,
            duration
        });

        setTimeout(() => {
            this.hideNotification();
        }, duration);
    }

    showErrorNotification(title: string, description: string, duration: number = 7000) {
        this.message.emit({
            show: true,
            icon: 'error' as NotificationType,
            title,
            description,
            duration,
        });

        setTimeout(() => {
            this.hideNotification();
        }, duration);
    }

    hideNotification() {
        this.message.emit({
            show: false,
            icon: '' as NotificationType,
            title: '',
            description: '',
            duration: 0,
        });
    }
}
