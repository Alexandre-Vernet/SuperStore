import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
    selector: 'superstore-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss'],
})
export class SecurityComponent {

    formPassword = new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly router: Router
    ) {
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

        this.authService.updatePassword(password)
            .subscribe(() => {
                this.formPassword.reset();
            });
    }

    deleteAccount() {
        this.userService.deleteUser(this.authService.user.id)
            .subscribe(() => {
                this.authService.signOut();
                this.router.navigateByUrl('/');
            });
    }
}
