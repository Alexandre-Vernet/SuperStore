import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerServiceRoutingModule } from './customer-service-routing.module';
import { ContactComponent } from './contact/contact.component';
import { CustomerServiceComponent } from './customer-service.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './faq/faq.component';
import { ShippingComponent } from './shipping/shipping.component';
import { ReturnsComponent } from './returns/returns.component';
import { WarrantyComponent } from './warranty/warranty.component';
import { SecurePaymentComponent } from './secure-payment/secure-payment.component';
import { FindAStoreComponent } from './find-a-store/find-a-store.component';

@NgModule({
  declarations: [
    CustomerServiceComponent,
    ContactComponent,
    FaqComponent,
    ShippingComponent,
    ReturnsComponent,
    WarrantyComponent,
    SecurePaymentComponent,
    FindAStoreComponent,
  ],
  imports: [CommonModule, CustomerServiceRoutingModule, ReactiveFormsModule],
})
export class CustomerServiceModule {}
