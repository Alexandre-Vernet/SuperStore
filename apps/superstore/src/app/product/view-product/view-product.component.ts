import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../product.service";
import { Observable } from "rxjs";
import { CartService } from "../../cart/cart.service";
import { ProductDto, productSize, ProductSizeDto, ReviewDto } from "@superstore/interfaces";
import { ReviewService } from "../../review/review.service";

@Component({
    selector: 'superstore-view-product',
    templateUrl: './view-product.component.html',
    styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
    product: ProductDto;
    reviews: ReviewDto[];

    selectedSize: ProductSizeDto;
    productSize = productSize;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly reviewService: ReviewService,
        private readonly router: Router,
    ) {
    }

    ngOnInit() {
        this.getProduct();
        this.selectedSize = this.productSize[0];
    }

    filterProductsByCategory(category: string) {
        this.router.navigate(['/'], { queryParams: { category } });
    }

    getProduct() {
        // Get product slug from the URL
        const productSlug = this.route.snapshot.paramMap.get('slug');
        this.getProductFromSlug(productSlug)
            .subscribe(product => {
                this.product = product;

                this.reviewService
                    .getReviewsForProduct(product)
                    .subscribe(reviews => {
                        this.reviews = reviews;
                    });
            });

    }

    getProductFromSlug(productSlug: string): Observable<ProductDto> {
        return this.productService.getProductFromSlug(productSlug);
    }

    selectSize(size: ProductSizeDto) {
        this.selectedSize = size;
    }

    addToCart(productId: number) {
        const size = this.selectedSize;
        this.cartService.addToCart(productId, size);
    }
}
