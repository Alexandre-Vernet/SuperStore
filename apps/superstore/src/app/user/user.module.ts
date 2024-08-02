import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { SecurityComponent } from './security/security.component';
import { AddressComponent } from './address/address.component';
import { ErrorModule } from '../error/error.module';

@NgModule({
  declarations: [
    ProfileComponent,
    UserComponent,
    SecurityComponent,
    AddressComponent,
  ],
    imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, ErrorModule]
})
export class UserModule {}
