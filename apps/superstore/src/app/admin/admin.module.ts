import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [AdminComponent, ListProductsComponent, AddProductComponent],
    imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule]
})
export class AdminModule {
}
