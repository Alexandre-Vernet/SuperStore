import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../product.service';
import {combineLatest, Observable, of, Subject, switchMap} from 'rxjs';
import {CartService} from '../../cart/cart.service';
import {ProductDto, productSize, ProductSizeDto, ReviewDto} from '@superstore/interfaces';
import {ReviewService} from '../../review/review.service';

@Component({
    selector: 'superstore-view-product',
    templateUrl: './view-product.component.html',
    styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit, OnDestroy {
    product: ProductDto;
    reviews: ReviewDto[];

    selectedSize: ProductSizeDto;
    productSize = productSize;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly reviewService: ReviewService,
        private readonly router: Router,
    ) {
    }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');

        this.getProductFromSlug(slug)
            .pipe(
                switchMap((product: ProductDto) =>
                    combineLatest([
                        of(product),
                        this.reviewService.getReviewsForProduct(product)
                    ])
                )
            ).subscribe(([product, reviews]: [ProductDto, ReviewDto[]]) => {
            this.product = product;
            this.reviews = reviews;
        });

        this.selectedSize = this.productSize[0];
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    filterProductsByCategory(category: string) {
        this.router.navigate(['/'], { queryParams: { category } });
    }

    getProductFromSlug(productSlug: string): Observable<ProductDto> {
        return this.productService.getProductFromSlug(productSlug);
    }

    selectSize(size: ProductSizeDto) {
        this.selectedSize = size;
    }

    addToCart(product: ProductDto) {
        product.size = this.selectedSize;
        this.cartService.addToCart(product);
    }
}
