import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { NewsletterDto, SendNewsletterDto } from "@superstore/interfaces";
import { catchError, Observable, tap } from "rxjs";
import { NotificationsService } from "../shared/notifications/notifications.service";
import { ErrorService } from '../error/error.service';


@Injectable({
    providedIn: 'root'
})
export class NewsletterService {
    newsletterUrl = environment.newsletterUrl();

    constructor(
        private readonly http: HttpClient,
        private readonly notificationsService: NotificationsService,
        private readonly errorService: ErrorService,
    ) {
    }

    isUserSubscribedToNewsletter(email: string): Observable<boolean> {
        return this.http.get<boolean>(`${ this.newsletterUrl }/is-subscribed/${ email }`);
    }

    subscribeUserToNewsletter(email: string): Observable<void> {
        const newsletter: NewsletterDto = {
            email,
            isSubscribed: true,
        }
        return this.http.post<void>(`${ this.newsletterUrl }`, newsletter)
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'You have been subscribed to our newsletter');
                }),
            );
    }

    updateSubscription(newsletter: NewsletterDto): Observable<void> {
        return this.http.put<void>(`${ this.newsletterUrl }`, newsletter)
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'Subscription updated', 2000);
                }),
                catchError((err) => {
                    this.errorService.setError(err.error.message);
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
                    this.errorService.setError(err.error.message);
                    throw err;
                })
            );
    }
}
