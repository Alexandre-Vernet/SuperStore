import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    selector: 'superstore-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {

    formSignUp = new FormGroup({
        firstName: new FormControl('Test', [Validators.required]),
        lastName: new FormControl('Zebi', [Validators.required]),
        email: new FormControl('test@gmail.com', [Validators.required, Validators.email]),
        password: new FormControl('test123', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('test123', [Validators.required, Validators.minLength(6)]),
    });

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    signUp() {
        const { firstName, lastName, email, password, confirmPassword } = this.formSignUp.value;
        if (password !== confirmPassword) {
            this.formSignUp.setErrors({ passwordNotMatch: true });
            return;
        }
        this.authService.signUp(firstName, lastName, email, password)
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
