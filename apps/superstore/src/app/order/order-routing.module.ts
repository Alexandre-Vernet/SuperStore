import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmOrderComponent } from "./confirm-order/confirm-order.component";
import { AuthGuard } from "../auth/auth.guard";
import { OrderHistoryComponent } from "./order-history/order-history.component";

const routes: Routes = [
    {
        path: 'confirm-order',
        component: ConfirmOrderComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'order-history',
        component: OrderHistoryComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule {
}
