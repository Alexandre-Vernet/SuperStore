import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ReviewModule } from '../review/review.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [OrderHistoryComponent],
    imports: [CommonModule, OrderRoutingModule, ReviewModule, SharedModule],
})
export class OrderModule {
}
