import { Component, OnInit } from '@angular/core';
import { ProductService } from "../product.service";
import { ProductProductPipe } from "../product.pipe";
import { ProductDto } from "@superstore/libs";

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[] = [];

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

    updateOrderBy($event) {
        const orderBy = $event.target.value;

        this.products.sort((a, b) => {
            if (orderBy === 'lowestPrice') {
                return a.price - b.price;
            } else if (orderBy === 'highestPrice') {
                return b.price - a.price;
            } else if (orderBy === 'name') {
                return a.name.localeCompare(b.name);
            } else {
                return 0;
            }
        });
    }
}
