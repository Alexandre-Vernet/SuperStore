import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { SecurityComponent } from './security/security.component';
import { ErrorModule } from '../error/error.module';
import { AddressModule } from '../address/address.module';

@NgModule({
    declarations: [
        ProfileComponent,
        UserComponent,
        SecurityComponent
    ],
    imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, ErrorModule, AddressModule]
})
export class UserModule {
}
