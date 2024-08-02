import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListOrdersComponent } from './orders/list-orders/list-orders.component';
import { TabsComponent } from './tabs/tabs.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { UpdateUserComponent } from './users/update-user/update-user.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { OrdersPipe } from './orders/orders.pipe';
import { ProductsPipe } from './products/products.pipe';
import { UsersPipe } from './users/users.pipe';
import { SharedModule } from '../shared/shared.module';
import { AdminSearchBarComponent } from './search-bar/admin-search-bar/admin-search-bar.component';
import { SendNewsletterComponent } from './send-newsletter/send-newsletter.component';
import { EditPromotionComponent } from "./promotions-code/edit-promotion/edit-promotion.component";
import { ListPromotionsComponent } from "./promotions-code/list-promotions/list-promotions.component";
import { PromotionsPipe } from "./promotions-code/promotions.pipe";
import { AppModule } from '../app.module';
import { ErrorModule } from '../error/error.module';

@NgModule({
    declarations: [
        AdminComponent,
        ListProductsComponent,
        CreateProductComponent,
        ListOrdersComponent,
        ListUsersComponent,
        TabsComponent,
        UpdateUserComponent,
        UpdateUserComponent,
        CreateOrderComponent,
        OrdersPipe,
        ProductsPipe,
        UsersPipe,
        PromotionsPipe,
        AdminSearchBarComponent,
        AdminSearchBarComponent,
        SendNewsletterComponent,
        EditPromotionComponent,
        ListPromotionsComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        ErrorModule
    ],
    exports: [ListProductsComponent],
})
export class AdminModule {
}
