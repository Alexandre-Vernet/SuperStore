import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NewsletterService } from "../../newsletter/newsletter.service";
import { NotificationsService } from "../../shared/notifications/notifications.service";
import { NewsletterDto } from "@superstore/interfaces";


@Component({
    selector: 'superstore-send-newsletter',
    templateUrl: './send-newsletter.component.html',
    styleUrls: ['./send-newsletter.component.scss'],
})
export class SendNewsletterComponent {

    constructor(
        private readonly newsletterService: NewsletterService,
        private readonly notificationService: NotificationsService,
    ) {
    }

    formSendNewsletter = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
    });

    sendNewsletter() {
        const { title, description } = this.formSendNewsletter.value;

        const newsletter: NewsletterDto = {
            title,
            description,
            emails: []
        }

        if (this.formSendNewsletter.valid) {
            this.newsletterService.sendNewsletter(newsletter)
                .subscribe({
                    next: () => this.notificationService.showSuccessNotification('Success', 'Newsletter sent successfully!'),
                    error: (err) => this.notificationService.showErrorNotification('Error', err.error.message),
                });
        }
    }
}
