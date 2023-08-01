import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerServiceComponent } from "./customer-service.component";
import { ContactComponent } from "./contact/contact.component";
import { FaqComponent } from "./faq/faq.component";
import { ShippingComponent } from "./shipping/shipping.component";
import { ReturnsComponent } from "./returns/returns.component";
import { WarrantyComponent } from "./warranty/warranty.component";
import { SecurePaymentComponent } from "./secure-payment/secure-payment.component";
import { FindAStoreComponent } from "./find-a-store/find-a-store.component";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";

const routes: Routes = [
    {
        path: '',
        component: CustomerServiceComponent,
        canActivate: [OptionalAuthGuard],
        children: [
            {
                path: 'contact',
                component: ContactComponent
            },
            {
                path: 'shipping',
                component: ShippingComponent
            },
            {
                path: 'returns',
                component: ReturnsComponent
            },
            {
                path: 'warranty',
                component: WarrantyComponent
            },
            {
                path: 'secure-payment',
                component: SecurePaymentComponent
            },
            {
                path: 'FAQ',
                component: FaqComponent
            },
            {
                path: 'find-a-store',
                component: FindAStoreComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerServiceRoutingModule {
}
