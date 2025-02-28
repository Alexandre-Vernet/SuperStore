import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { UserDto } from '@superstore/interfaces';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

    user: UserDto;

    formPassword = new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.authService.user$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => this.user = user);
    }

    submitForm() {
        if (this.formPassword.invalid) {
            return;
        }
        this.updatePassword();
    }

    updatePassword() {
        const password = this.formPassword.value.password;
        const confirmPassword = this.formPassword.value.confirmPassword;
        if (password !== confirmPassword) {
            this.formPassword.setErrors({ passwordMismatch: true });
            return;
        }

        this.authService.updatePassword(password, confirmPassword)
            .subscribe({
                next: () => this.formPassword.reset(),
                error: (err) => this.formPassword.setErrors({ [err.error.field]: err.error.message })
            });
    }

    deleteAccount() {
        this.userService.deleteUser(this.user.id)
            .pipe(take(1))
            .subscribe(() => this.router.navigateByUrl('/'));
    }
}
