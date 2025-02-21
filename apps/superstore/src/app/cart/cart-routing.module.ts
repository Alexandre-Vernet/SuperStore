import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCartComponent } from "./view-cart/view-cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { checkoutGuard } from "./checkout/checkout.guard";
import { CartComponent } from "./cart.component";
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
    {
        path: 'cart',
        component: CartComponent,
        children: [
            {
                path: 'view-cart',
                component: ViewCartComponent,
            },
            {
                path: 'checkout',
                component: CheckoutComponent,
                canActivate: [checkoutGuard, authGuard]

            },
            {
                path: '**',
                redirectTo: 'view-cart'
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CartRoutingModule {
}
