import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCartComponent } from "./view-cart/view-cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CheckoutGuard } from "./checkout/checkout.guard";
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CartRoutingModule {
}
