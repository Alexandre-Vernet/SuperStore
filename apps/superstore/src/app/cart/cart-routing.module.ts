import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCartComponent } from "./view-cart/view-cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CheckoutGuard } from "./checkout/checkout.guard";
import { AuthGuard } from "../auth/auth.guard";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";
import { CartComponent } from "./cart.component";

const routes: Routes = [
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [OptionalAuthGuard],
        children: [
            {
                path: 'view-cart',
                component: ViewCartComponent,
                canActivate: [OptionalAuthGuard]
            },
            {
                path: 'checkout',
                component: CheckoutComponent,
                canActivate: [CheckoutGuard, AuthGuard]

            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CartRoutingModule {
}
