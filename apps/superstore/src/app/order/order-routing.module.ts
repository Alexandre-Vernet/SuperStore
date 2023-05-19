import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmOrderComponent } from "./confirm-order/confirm-order.component";
import { AuthGuard } from "../auth/auth.guard";
import { ViewOrdersComponent } from "./view-orders/view-orders.component";

const routes: Routes = [
    {
        path: 'confirm-order',
        component: ConfirmOrderComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'view-orders',
        component: ViewOrdersComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule {
}
