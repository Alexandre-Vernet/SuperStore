import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../user/user.service";

@Component({
    selector: 'superstore-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
    formContact = new FormGroup({
        firstName: new FormControl('azdzad', [Validators.required]),
        lastName: new FormControl('azdazdazd', [Validators.required]),
        email: new FormControl('azdazd@gmail.com', [Validators.required, Validators.email]),
        phone: new FormControl('azd'),
        subject: new FormControl('azd', [Validators.required]),
        message: new FormControl('zdazdzdzdzddazd', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    });

    constructor(
        private readonly userService: UserService
    ) {
    }

    submit() {
        if (this.formContact.valid) {
            this.sendEmail();
        }
    }

    sendEmail() {
        const { firstName, lastName, email, phone, subject, message } = this.formContact.value;
        this.userService.sendContactEmail(firstName, lastName, email, phone, subject, message).subscribe();
    }
}
