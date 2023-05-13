import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { SignInUserDto } from "@superstore/libs";

@Component({
    selector: 'superstore-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {

    formSignIn = new FormGroup({
        email: new FormControl('test@gmail.com', [Validators.required, Validators.email]),
        password: new FormControl('test123', [Validators.required, Validators.minLength(6)]),
    });

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    signIn() {
        const {
            email,
            password,
        } = this.formSignIn.value;

        const user: SignInUserDto = {
            email,
            password,
        }
        this.authService.signIn(user)
            .subscribe({
                next: () => {
                    console.log('ok');
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }
}
