import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user/user.service';
import { distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
    formContact = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phone: new FormControl(''),
        subject: new FormControl('', [Validators.required]),
        message: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)])
    });

    buttonSubmit$ = new Subject<{
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        subject: string,
        message: string
    }>();
    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly userService: UserService
    ) {
    }

    ngOnInit() {
        this.buttonSubmit$.pipe(
            takeUntil(this.unsubscribe$),
            distinctUntilChanged(),
            switchMap(({ firstName, lastName, email, phone, subject, message }) =>
                this.userService.sendContactEmail(firstName, lastName, email, phone, subject, message)
            )
        ).subscribe({
            next: () => this.formContact.reset(),
            error: (err) => this.formContact.setErrors({ error: err.error.message })
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    submitForm() {
        const { firstName, lastName, email, phone, subject, message } = this.formContact.value;
        this.buttonSubmit$.next({ firstName, lastName, email, phone, subject, message });
    }
}
