import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCartComponent } from "./view-cart/view-cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CheckoutGuard } from "./checkout/checkout.guard";
import { ConfirmOrderComponent } from "../order/confirm-order/confirm-order.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
    {
        path: '',
        component: ViewCartComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [CheckoutGuard, AuthGuard]

    },
    {
        path: 'confirm-order',
        component: ConfirmOrderComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CartRoutingModule {
}
