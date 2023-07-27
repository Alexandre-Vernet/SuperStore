import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'sign-in',
                component: SignInComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
