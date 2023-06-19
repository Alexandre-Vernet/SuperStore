import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CreateNewsletterDto, NewsletterDto } from "@superstore/interfaces";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NewsletterService {
    newsletterUrl = environment.newsletterUrl();

    constructor(
        private readonly http: HttpClient
    ) {
    }

    storeEmailInDatabase(email: string): Observable<void> {
        const newsletter: CreateNewsletterDto = {
            email,
            isSubscribed: true,
        }
        return this.http.post<void>(`${ this.newsletterUrl }`, newsletter);
    }

    sendNewsletter(newsletter: NewsletterDto): Observable<void> {
        return this.http.post<void>(`${ this.newsletterUrl }/send-email`, newsletter);
    }
}
