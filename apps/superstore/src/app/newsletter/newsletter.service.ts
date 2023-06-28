import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { NewsletterDto, SendNewsletterDto } from "@superstore/interfaces";
import { catchError, Observable, tap } from "rxjs";
import { NotificationsService } from "../shared/notifications/notifications.service";


@Injectable({
    providedIn: 'root'
})
export class NewsletterService {
    newsletterUrl = environment.newsletterUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly notificationsService: NotificationsService
    ) {
    }

    isUserSubscribedToNewsletter(email: string): Observable<boolean> {
        return this.http.get<boolean>(`${ this.newsletterUrl }/is-subscribed/${ email }`);
    }

    storeEmailInDatabase(email: string): Observable<void> {
        const newsletter: NewsletterDto = {
            email,
            isSubscribed: true,
        }
        return this.http.post<void>(`${ this.newsletterUrl }`, newsletter);
    }

    updateSubscription(email: string, isSubscribed: boolean): Observable<void> {
        const newsletter: NewsletterDto = {
            email,
            isSubscribed,
        };

        return this.http.put<void>(`${ this.newsletterUrl }`, newsletter)
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'Subscription updated', 2000);
                }),
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    sendNewsletter(newsletter: SendNewsletterDto): Observable<void> {
        return this.http.post<void>(`${ this.newsletterUrl }/send-email`, newsletter)
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'Newsletter sent successfully!');
                }),
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }
}
