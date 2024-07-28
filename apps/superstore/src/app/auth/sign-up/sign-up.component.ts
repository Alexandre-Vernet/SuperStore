import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { UserDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {

    formSignUp = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    constructor(
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    signUp() {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = this.formSignUp.value;

        const user: UserDto = {
            addresses: [],
            firstName,
            lastName,
            email,
            password,
            isAdmin: false,
        }
        if (password !== confirmPassword) {
            this.formSignUp.setErrors({ passwordNotMatch: true });
            return;
        }
        this.authService.signUp(user)
            .subscribe({
                next: () => this.router.navigateByUrl('/'),
                error: (err) => {
                    this.formSignUp.setErrors({ error: err.error.message });
                }
            });
    }
}
