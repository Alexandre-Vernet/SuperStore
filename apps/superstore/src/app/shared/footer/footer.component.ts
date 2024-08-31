import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../../newsletter/newsletter.service';
import { Router } from '@angular/router';
import { catchError, distinctUntilChanged, filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { categoriesAllowed } from '@superstore/interfaces';

@Component({
    selector: 'superstore-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

    protected readonly categories = categoriesAllowed;
    currentYear = new Date().getFullYear();
    formEmailNewsletter = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });

    buttonSignUpNewsletter$ = new Subject<string>;
    unsubscribe$ = new Subject<void>;

    constructor(
        private readonly newsletterService: NewsletterService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.buttonSignUpNewsletter$.pipe(
            takeUntil(this.unsubscribe$),
            distinctUntilChanged(),
            switchMap((email) => this.newsletterService.subscribeUserToNewsletter(email)
                .pipe(
                    catchError((err) => {
                        this.formEmailNewsletter.setErrors({ error: err.error.message });
                        return of(null);
                    })
                )),
            filter(response => response !== null)
        ).subscribe(() => this.formEmailNewsletter.reset());
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    filterProductsByCategory(category: string) {
        this.router.navigate(['/'], { queryParams: { category } });
    }

    submitEmailNewsletter() {
        const email = this.formEmailNewsletter.value.email;
        this.buttonSignUpNewsletter$.next(email);
    }
}
