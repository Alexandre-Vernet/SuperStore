import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { AuthGuard } from '../auth/auth.guard';
import { OrderHistoryComponent } from './order-history/order-history.component';

@NgModule({
  declarations: [OrderHistoryComponent],
  imports: [CommonModule, OrderRoutingModule],
  providers: [AuthGuard],
})
export class OrderModule {}
