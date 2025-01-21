import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, switchMap, takeUntil } from 'rxjs';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { NewsletterDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-unsubscribe-newsletter',
    templateUrl: './unsubscribe-newsletter.component.html',
    styleUrls: ['./unsubscribe-newsletter.component.scss']
})
export class UnsubscribeNewsletterComponent implements OnInit, OnDestroy {

    email$ = this.activatedRoute.queryParamMap.pipe(
        map(params => params.get('email'))
    );

    unsubscribe$ = new Subject<void>();


    constructor(
        private activatedRoute: ActivatedRoute,
        private newsletterService: NewsletterService
    ) {
    }

    ngOnInit() {
        this.email$.pipe(
            takeUntil(this.unsubscribe$),
            switchMap((email) => this.newsletterService.updateSubscription(new NewsletterDto(email, false)))
        ).subscribe();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
