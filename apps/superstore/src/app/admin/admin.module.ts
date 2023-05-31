import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrdersComponent } from './orders/orders.component';
import { TabsComponent } from './tabs/tabs.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { UpdateUserComponent } from './users/update-user/update-user.component';

@NgModule({
    declarations: [
        AdminComponent,
        ListProductsComponent,
        AddProductComponent,
        OrdersComponent,
        ListUsersComponent,
        TabsComponent,
        UpdateUserComponent,
        UpdateUserComponent,
    ],
    imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule],
})
export class AdminModule {
}
