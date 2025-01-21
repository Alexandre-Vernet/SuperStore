import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

    products: ProductDto[] = [];

    constructor(
        private readonly productService: ProductService
    ) {
    }

    ngOnInit() {
        this.productService.products$
            .subscribe(products => this.products = products);
    }
}
