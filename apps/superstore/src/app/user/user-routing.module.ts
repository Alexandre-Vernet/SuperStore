import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from "./profile/profile.component";
import { UserComponent } from "./user.component";
import { SecurityComponent } from "./security/security.component";
import { CreateAddressComponent } from "./address/create-address/create-address.component";
import { authGuard } from "../auth/auth.guard";
import { UnsubscribeNewsletterComponent } from './unsubscribe-newsletter/unsubscribe-newsletter.component';

const routes: Routes = [
    {
        path: 'user',
        component: UserComponent,
        children: [
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [authGuard]
            },
            {
                path: 'security',
                component: SecurityComponent,
                canActivate: [authGuard]
            },
            {
                path: 'address',
                component: CreateAddressComponent,
                canActivate: [authGuard]
            },
            {
                path: 'unsubscribe-newsletter',
                component: UnsubscribeNewsletterComponent,
            },
            {
                path: '**',
                redirectTo: 'profile'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
