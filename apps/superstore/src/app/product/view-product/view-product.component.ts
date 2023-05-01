import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../product.service";
import { Observable } from "rxjs";
import { Product } from "../product";

@Component({
    selector: 'superstore-view-product',
    templateUrl: './view-product.component.html',
    styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
    product: Product;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly productService: ProductService,
    ) {
    }

    ngOnInit() {
        // Get the product ID from the URL
        const productId = this.route.snapshot.paramMap.get('id');
        this.getProduct(productId)
            .subscribe(product => this.product = product)
    }

    getProduct(id: string): Observable<Product> {
        return this.productService.getProduct(id);
    }
}
