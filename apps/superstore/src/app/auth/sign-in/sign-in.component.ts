import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { SignInUserDto } from "@superstore/interfaces";
import { Router } from "@angular/router";

@Component({
    selector: 'superstore-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements AfterViewInit {

    formSignIn = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    showModalForgotPassword = false;

    constructor(
        private readonly authService: AuthService,
        private router: Router,
        private cdRef: ChangeDetectorRef
    ) {
    }

    ngAfterViewInit() {
        this.authService.error ? this.formSignIn.setErrors({ error: this.authService.error }) : null;
        this.cdRef.detectChanges();
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
                next: () => this.router.navigateByUrl('/'),
                error: (err) => {
                    this.formSignIn.setErrors({ error: err.error.message });
                }
            });
    }

    public openModalForgotPassword(): void {
        this.showModalForgotPassword = true;
    }

    public closeModalForgotPassword(): void {
        this.showModalForgotPassword = false;
    }
}
