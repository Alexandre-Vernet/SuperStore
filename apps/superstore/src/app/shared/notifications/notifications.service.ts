import { EventEmitter, Injectable } from '@angular/core';
import { NotificationsDto, NotificationType } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    message = new EventEmitter<NotificationsDto>();

    showSuccessNotification(title: string, description: string) {
        this.message.emit({
            show: true,
            icon: 'success' as NotificationType,
            title,
            description,
        });
    }

    showErrorNotification(title: string, description: string, duration?: number) {
        this.message.emit({
            show: true,
            icon: 'error' as NotificationType,
            title,
            description,
            duration,
        });
    }
}
