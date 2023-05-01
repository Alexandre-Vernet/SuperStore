import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ListProductsComponent } from "./list-products/list-products.component";
import { ProductService } from "./product.service";


@NgModule({
    declarations: [ListProductsComponent],
    imports: [
        CommonModule,
        ProductRoutingModule
    ],
    providers: [ProductService]
})
export class ProductModule {
}
