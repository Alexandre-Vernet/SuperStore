import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NewsletterService } from "../../newsletter/newsletter.service";
import { SendNewsletterDto } from "@superstore/interfaces";


@Component({
    selector: 'superstore-send-newsletter',
    templateUrl: './send-newsletter.component.html',
    styleUrls: ['./send-newsletter.component.scss'],
})
export class SendNewsletterComponent {

    constructor(
        private readonly newsletterService: NewsletterService,
    ) {
    }

    formSendNewsletter = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
    });

    sendNewsletter() {
        const { title, description } = this.formSendNewsletter.value;

        if (this.formSendNewsletter.valid) {
            const newsletter: SendNewsletterDto = {
                title,
                description,
                emails: []
            };

            this.newsletterService.sendNewsletter(newsletter)
                .subscribe();
        }
    }
}
