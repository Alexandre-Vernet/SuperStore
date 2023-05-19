import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { AuthGuard } from '../auth/auth.guard';
import { ViewOrdersComponent } from './view-orders/view-orders.component';

@NgModule({
  declarations: [ViewOrdersComponent],
  imports: [CommonModule, OrderRoutingModule],
  providers: [AuthGuard],
})
export class OrderModule {}
