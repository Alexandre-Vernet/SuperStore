import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ListProductsComponent } from './list-products/list-products.component';
import { ProductService } from './product.service';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductComponent } from "./product.component";
import { FormsModule } from "@angular/forms";
import { ReviewModule } from "../review/review.module";
import { OptionalAuthGuard } from "../auth/optional-auth.guard";

@NgModule({
    declarations: [
        ListProductsComponent,
        ViewProductComponent,
        ProductComponent
    ],
    imports: [CommonModule, ProductRoutingModule, FormsModule, ReviewModule],
    providers: [ProductService, OptionalAuthGuard],
})
export class ProductModule {
}
