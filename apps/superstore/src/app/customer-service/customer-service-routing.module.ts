import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerServiceComponent } from "./customer-service.component";
import { ContactComponent } from "./contact/contact.component";
import { FaqComponent } from "./faq/faq.component";
import { ShippingComponent } from "./shipping/shipping.component";

const routes: Routes = [
    {
        path: '',
        component: CustomerServiceComponent,
        children: [
            {
                path: 'shipping',
                component: ShippingComponent
            },
            {
                path: 'contact',
                component: ContactComponent
            },
            {
                path: 'FAQ',
                component: FaqComponent
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
