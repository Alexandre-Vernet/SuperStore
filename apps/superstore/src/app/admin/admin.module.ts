import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListOrdersComponent } from './orders/list-orders/list-orders.component';
import { TabsComponent } from './tabs/tabs.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { UpdateUserComponent } from './users/update-user/update-user.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';

@NgModule({
    declarations: [
        AdminComponent,
        ListProductsComponent,
        AddProductComponent,
        ListOrdersComponent,
        ListUsersComponent,
        TabsComponent,
        UpdateUserComponent,
        UpdateUserComponent,
        EditOrderComponent,
    ],
    imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule],
})
export class AdminModule {
}
