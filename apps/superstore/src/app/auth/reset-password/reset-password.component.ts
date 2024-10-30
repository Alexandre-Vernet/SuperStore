import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    formResetPassword = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.min(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.min(6)])
    });
    token: string;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.pipe(
            takeUntil(this.unsubscribe$),
            distinctUntilChanged(),
            map((param: { token: string }) => {
                localStorage.setItem('accessToken', param.token);
                return param.token;
            }),
            switchMap(() => this.authService.signInWithAccessToken())
        ).subscribe({
            next: ({ accessToken }) => this.token = accessToken,
            error: () => {
                this.authService.error = 'Invalid token';
                void this.router.navigate(['/sign-in']);
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
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
        const { newPassword: password, confirmPassword } = this.formResetPassword.value;

        this.authService.updatePassword(password, confirmPassword)
            .subscribe({
                next: () => {
                    this.formResetPassword.reset();
                    void this.router.navigateByUrl('/');
                },
                error: (err) => {
                    if (err.error?.message) {
                        this.formResetPassword.setErrors({ error: err.error.message });
                    }
                }
            });
    }
}
