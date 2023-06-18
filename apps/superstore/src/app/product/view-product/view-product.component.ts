import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../product.service";
import { Observable } from "rxjs";
import { CartService } from "../../cart/cart.service";
import { ProductDto, ProductSizeDto, ReviewDto } from "@superstore/interfaces";
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
    productSize: ProductSizeDto[] = [
        {
            tag: 'S',
            name: 'Small',
        },
        {
            tag: 'M',
            name: 'Medium',
        },
        {
            tag: 'L',
            name: 'Large',
        },
        {
            tag: 'XL',
            name: 'Extra Large',
        },
        {
            tag: 'XXL',
            name: 'Extra Extra Large',
        }
    ];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly reviewService: ReviewService
    ) {
    }

    ngOnInit() {
        this.getProduct();
        this.selectedSize = this.productSize[0];
    }

    getProduct() {
        // Get the product ID from the URL
        const productSlug = this.route.snapshot.paramMap.get('id');
        this.getProductFromSlug(productSlug)
            .subscribe(product => {
                this.product = product;

                this.reviewService
                    .getReviewsForProduct(product.id)
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
