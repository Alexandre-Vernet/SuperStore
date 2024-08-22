import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from "./profile/profile.component";
import { UserComponent } from "./user.component";
import { SecurityComponent } from "./security/security.component";
import { CreateAddressComponent } from "../address/create-address/create-address.component";
import { AuthGuard } from "../auth/auth.guard";

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
                canActivate: [AuthGuard]
            },
            {
                path: 'security',
                component: SecurityComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'address',
                component: CreateAddressComponent,
                canActivate: [AuthGuard]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
