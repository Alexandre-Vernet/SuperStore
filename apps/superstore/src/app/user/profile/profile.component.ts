import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { NewsletterDto, UserDto } from '@superstore/interfaces';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../user.service";
import { NewsletterService } from "../../newsletter/newsletter.service";

@Component({
    selector: 'superstore-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

    user: UserDto;
    formUser = new FormGroup({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        isSubscribedToNewsletter: new FormControl(false),
        currency: new FormControl(localStorage.getItem('currency') || 'USD'),
    });

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly newsletterService: NewsletterService,
    ) {
    }

    ngOnInit() {
        this.user = this.authService.user;
        this.formUser.patchValue(this.user);
        this.userIsSubscribedToNewsletter();
    }

    userIsSubscribedToNewsletter() {
        const email = this.user.email;
        this.newsletterService.isUserSubscribedToNewsletter(email)
            .subscribe((isSubscribedToNewsletter) => {
                this.formUser.patchValue({ isSubscribedToNewsletter });
            });
    }

    toggleNewsletterSubscription() {
        this.formUser.patchValue({ isSubscribedToNewsletter: !this.formUser.value.isSubscribedToNewsletter });
        const isSubscribed = this.formUser.value.isSubscribedToNewsletter;
        const email = this.user.email;


        const newsletter: NewsletterDto = {
            email,
            isSubscribed,
        };

        console.log(newsletter.isSubscribed);

        this.newsletterService.updateSubscription(newsletter)
            .subscribe();
    }

    getCurrency() {
        return localStorage.getItem('currency');
    }

    toggleCurrency() {
        const currency = this.formUser.value.currency;
        if (currency === 'EUR') {
            localStorage.setItem('currency', 'USD');
            this.formUser.patchValue({ currency: 'USD' })
        } else {
            localStorage.setItem('currency', 'EUR');
            this.formUser.patchValue({ currency: 'EUR' })
        }
    }

    submitForm() {
        if (this.formUser.invalid) {
            return;
        }
        this.updateUser();
    }

    updateUser() {
        const { firstName, lastName, email } = this.formUser.value;

        const user: UserDto = {
            addresses: this.user.addresses,
            password: this.user.password,
            id: this.user.id,
            firstName,
            lastName,
            email,
            isAdmin: this.user.isAdmin
        };

        this.userService.updateUser(user)
            .subscribe((user) => {
                this.user = user;
                this.formUser.patchValue(user);
            });
    }
}
