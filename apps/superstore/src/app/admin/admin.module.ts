import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListProductsComponent } from './list-products/list-products.component';

@NgModule({
  declarations: [AdminComponent, ListProductsComponent],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
