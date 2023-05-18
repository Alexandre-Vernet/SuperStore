import { EventEmitter, Injectable } from '@angular/core';
import { NotificationsDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    message = new EventEmitter<NotificationsDto>();

    constructor() {
    }
}
