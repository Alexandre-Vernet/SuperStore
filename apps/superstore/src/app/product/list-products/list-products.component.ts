import { Component, OnInit } from '@angular/core';
import { ProductService } from "../product.service";
import { Product } from "../product";
import { ProductProductPipe } from "../product.pipe";

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {

    products: Product[] = [];

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        this.getProducts();
    }

    getProducts() {
        return this.productService.getProducts()
            .subscribe(products => {
                this.products = products;
            });
    }

    convertProductNameToSlug(name: string): string {
        return new ProductProductPipe().convertProductNameToSlug(name);
    }
}
