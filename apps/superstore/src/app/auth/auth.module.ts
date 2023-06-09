import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth.interceptor";

@NgModule({
    declarations: [
        AuthComponent,
        SignInComponent,
        SignUpComponent
    ],
    imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
    providers: [{
        provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }]
})
export class AuthModule {
}
