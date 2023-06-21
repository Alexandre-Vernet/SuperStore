import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { UpdateUserDto, UserDto } from "@superstore/interfaces";
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
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        isSubscribedToNewsletter: new FormControl(false),
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
        const isSubscribedToNewsletter = this.formUser.value.isSubscribedToNewsletter;
        const email = this.user.email;
        this.newsletterService.updateSubscription(email, isSubscribedToNewsletter)
            .subscribe(() => {
                this.userIsSubscribedToNewsletter();
            });
    }

    // TODO - add validation to form
    submitForm() {
        if (this.formUser.invalid) {
            return;
        }
        this.updateUser();
    }

    updateUser() {
        const { firstName, lastName, email } = this.formUser.value;

        const user: UpdateUserDto = {
            id: this.user.id,
            firstName,
            lastName,
            email,
            isAdmin: this.user.isAdmin,
        };

        this.userService.updateUser(user)
            .subscribe((user) => {
                this.user = user;
                this.formUser.patchValue(user);
            });
    }
}
