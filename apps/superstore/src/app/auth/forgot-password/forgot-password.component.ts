import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    selector: 'superstore-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
    @Input() showModalForgotPassword = false;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    formForgotPassword = new FormGroup({
        emailAddressResetPassword: new FormControl('', [Validators.required, Validators.email])
    });

    constructor(
        private readonly authService: AuthService
    ) {
    }

    submitForm() {
        if (this.formForgotPassword.valid) {
            this.sendEmailForgotPassword();
        }
        return;
    }

    sendEmailForgotPassword() {
        const { emailAddressResetPassword: email } = this.formForgotPassword.value;
        this.authService.sendEmailForgotPassword(email)
            .subscribe(() => {
                this.closeModalForgotPassword();
            });
    }

    public closeModalForgotPassword(): void {
        this.closeModal.emit();
    }
}
