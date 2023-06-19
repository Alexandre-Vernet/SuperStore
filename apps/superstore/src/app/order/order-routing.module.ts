import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmOrderComponent } from "./confirm-order/confirm-order.component";
import { OrderHistoryComponent } from "./order-history/order-history.component";

const routes: Routes = [
    {
        path: 'confirm-order',
        component: ConfirmOrderComponent,
    },
    {
        path: 'order-history',
        component: OrderHistoryComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule {
}
