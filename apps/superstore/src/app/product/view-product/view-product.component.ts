import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../product.service';
import {combineLatest, Observable, of, Subject, switchMap} from 'rxjs';
import {CartService} from '../../cart/cart.service';
import {ProductDto, productSize, ProductSizeDto, ReviewDto} from '@superstore/interfaces';
import {ReviewService} from '../../review/review.service';
import { OrderService } from '../../order/order.service';

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

    currentImageIndex = 0;

    userCanAddReview: boolean;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        protected readonly reviewService: ReviewService,
        private readonly router: Router,
        private readonly orderService: OrderService,
    ) {
    }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');

        this.getProductFromSlug(slug)
            .pipe(
                switchMap((product: ProductDto) =>
                    combineLatest([
                        of(product),
                        this.reviewService.getReviewsForProduct(product),
                        this.orderService.userCanAddReview(product.id)
                    ])
                ),
            ).subscribe(([product, reviews, userHasBoughtProduct]: [ProductDto, ReviewDto[], boolean]) => {
            this.product = product;
            this.reviews = reviews;
            this.userCanAddReview = userHasBoughtProduct;
        });

        this.selectedSize = this.productSize[0];
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    nextImage() {
        if (this.currentImageIndex < this.product.images.length - 1) {
            this.currentImageIndex++;
        } else {
            this.currentImageIndex = 0;
        }
    }

    previousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        } else {
            this.currentImageIndex = this.product.images.length - 1;
        }
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
        product.size = this.selectedSize.tag;
        this.cartService.addToCart(product);
    }

    toggleAddReviewModal() {
        this.reviewService.openAddReviewModal();
    }
}
