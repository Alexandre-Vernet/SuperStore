import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [
    AdminComponent,
    ListProductsComponent,
    AddProductComponent,
    OrdersComponent,
    UsersComponent,
    TabsComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule],
})
export class AdminModule {}
