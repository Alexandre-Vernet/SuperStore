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
        const productSlug = this.route.snapshot.paramMap.get('id');
        this.getProductFromSlug(productSlug)
            .subscribe(product => {
                this.product = product;
            });
    }

    getProductFromSlug(productSlug: string): Observable<Product> {
        return this.productService.getProductFromSlug(productSlug);
    }
}
