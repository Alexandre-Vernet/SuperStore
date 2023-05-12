import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        AuthComponent,
        SignInComponent,
        SignUpComponent
    ],
    imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
})
export class AuthModule {
}
