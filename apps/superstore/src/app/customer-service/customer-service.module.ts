import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerServiceRoutingModule } from './customer-service-routing.module';
import { ContactComponent } from './contact/contact.component';
import { CustomerServiceComponent } from "./customer-service.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FaqComponent } from "./faq/faq.component";

@NgModule({
    declarations: [
        CustomerServiceComponent,
        ContactComponent,
        FaqComponent
    ],
    imports: [CommonModule, CustomerServiceRoutingModule, ReactiveFormsModule],
})
export class CustomerServiceModule {
}
