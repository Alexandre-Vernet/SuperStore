import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerServiceRoutingModule } from './customer-service-routing.module';
import { ContactComponent } from './contact/contact.component';
import { CustomerServiceComponent } from "./customer-service.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        CustomerServiceComponent,
        ContactComponent
    ],
    imports: [CommonModule, CustomerServiceRoutingModule, ReactiveFormsModule],
})
export class CustomerServiceModule {
}
