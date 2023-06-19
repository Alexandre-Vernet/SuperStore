import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { NewsletterDto } from "@superstore/interfaces";
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

    sendNewsletter(newsletter: NewsletterDto): Observable<void> {
        return this.http.post<void>(`${ this.newsletterUrl }/send-email`, newsletter);
    }
}
