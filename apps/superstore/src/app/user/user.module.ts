import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { PasswordComponent } from './password/password.component';
import { AddressComponent } from './address/address.component';

@NgModule({
  declarations: [
    ProfileComponent,
    UserComponent,
    PasswordComponent,
    AddressComponent,
  ],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule],
})
export class UserModule {}
