import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'superstore-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    formResetPassword = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.min(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.min(6)])
    });
    token: string;

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams
            .subscribe(params => {
                const { token } = params;
                localStorage.setItem('accessToken', token);
                this.authService.signInWithAccessToken().subscribe({
                    next: () => {
                        this.token = token;
                    },
                    error: () => {
                        this.authService.error = 'Invalid token';
                        this.router.navigate(['/sign-in']);
                    }
                });
            });
    }

    submitForm() {
        if (this.formResetPassword.valid) {
            const { newPassword, confirmPassword } = this.formResetPassword.value;
            if (newPassword !== confirmPassword) {
                this.formResetPassword.setErrors({ error: 'Passwords do not match' });
                return;
            }
            this.resetPassword();
        }
        return;
    }

    resetPassword() {
        const { newPassword: password } = this.formResetPassword.value;

        this.authService.updatePassword(password)
            .subscribe({
                next: () => {
                    this.formResetPassword.reset();
                    this.router.navigateByUrl('/');
                },
                error: (err) => {
                    if (err.error?.message) {
                        this.formResetPassword.setErrors({ error: err.error.message });
                    }
                }
            });
    }
}
