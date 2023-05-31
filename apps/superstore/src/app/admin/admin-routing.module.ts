import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductsComponent } from "./products/list-products/list-products.component";
import { AdminComponent } from "./admin.component";
import { ListUsersComponent } from "./users/list-users/list-users.component";
import { OrdersComponent } from "./orders/orders.component";

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'list-products',
                component: ListProductsComponent
            },
            {
                path: 'list-users',
                component: ListUsersComponent
            },
            {
                path: 'list-orders',
                component: OrdersComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}
