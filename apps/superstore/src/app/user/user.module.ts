import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [MyProfileComponent],
    imports: [CommonModule, UserRoutingModule, ReactiveFormsModule],
})
export class UserModule {
}
