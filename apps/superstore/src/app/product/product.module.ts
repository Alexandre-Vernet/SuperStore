import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ListProductsComponent } from './list-products/list-products.component';
import { ProductService } from './product.service';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductComponent } from "./product.component";
import { FormsModule } from "@angular/forms";
import { ReviewModule } from "../review/review.module";

@NgModule({
    declarations: [
        ListProductsComponent,
        ViewProductComponent,
        ProductComponent
    ],
    imports: [CommonModule, ProductRoutingModule, FormsModule, ReviewModule],
    providers: [ProductService],
})
export class ProductModule {
}
