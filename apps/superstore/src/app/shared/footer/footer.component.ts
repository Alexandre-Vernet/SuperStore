import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NewsletterService } from "../../newsletter/newsletter.service";
import { NotificationsService } from "../notifications/notifications.service";


@Component({
    selector: 'superstore-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

    constructor(
        private readonly newsletterService: NewsletterService,
        private readonly notificationsService: NotificationsService,
    ) {
    }

    formEmailNewsletter = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    submitEmailNewsletter() {
        if (this.formEmailNewsletter.valid) {
            const email = this.formEmailNewsletter.value.email;
            this.newsletterService.storeEmailInDatabase(email)
                .subscribe({
                    next: () => {
                        this.notificationsService.showSuccessNotification('Success', 'You have been subscribed to our newsletter');
                        this.formEmailNewsletter.reset();
                    },
                    error: (err) => {
                        this.notificationsService.showErrorNotification('Error', err.error.message);
                    }
                });
        }
    }

    getCurrentYear(): number {
        return new Date().getFullYear();
    }
}
