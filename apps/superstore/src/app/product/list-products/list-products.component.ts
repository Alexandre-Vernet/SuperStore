import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductDto } from '@superstore/interfaces';
import { BehaviorSubject, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { ReviewService } from '../../review/review.service';

@Component({
    selector: 'superstore-list-products',
    templateUrl: './list-products.component.html',
    styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, OnDestroy {

    @Input() filter$ = new Subject<{ type: string; value: string }>();

    products: ProductDto[] = [];
    filterProducts: ProductDto[] = [];

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 12,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly productService: ProductService,
        private readonly reviewService: ReviewService
    ) {
    }

    ngOnInit() {
        this.productService.findAllProducts()
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(products => this.pagination.totalPage.next(Math.ceil(products.length / this.pagination.itemsPerPage)))
            )
            .subscribe(products => {
                this.products = products;
                this.filterProducts = products;
            });


        this.filter$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(filter => {
                switch (filter.type) {
                    case 'category':
                        this.filterProducts = this.filterProductsByCategory(filter.value);
                        break;
                    case 'priceRange':
                        this.filterProducts = this.filterByPriceRange(filter.value);
                        break;
                    case 'label':
                        this.filterProductsByLabel(filter.value)
                            .pipe(takeUntil(this.unsubscribe$))
                            .subscribe(products => this.filterProducts = products);
                        break;
                    default:
                }
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }

    private filterProductsByCategory(category: string) {
        return this.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    private filterByPriceRange(priceRange: string) {
        switch (priceRange) {
            case '25-to-50':
                return this.products.filter((p) => p.price >= 25 && p.price < 50);
            case '50-to-100':
                return this.products.filter((p) => p.price >= 50 && p.price < 100);
            case '100-to-200':
                return this.products.filter((p) => p.price >= 100 && p.price < 200);
            case '200-and-above':
                return this.products.filter((p) => p.price >= 200);
            case 'under-25':
            default:
                return this.products;
        }
    }

    private filterProductsByLabel(label: string): Observable<ProductDto[]> {
        switch (label) {
            case '+price':
                return of(this.products.sort((a, b) => b.price - a.price));
            case '+name':
                return of(this.products.sort((a, b) => a.name.localeCompare(b.name)));
            case '-name':
                return of(this.products.sort((a, b) => b.name.localeCompare(a.name)));
            case '+rating': {
                return this.reviewService.findAllReviews()
                    .pipe(
                        map(reviews => {
                            const productsWithRating = this.products.map(product => {
                                const productReviews = reviews.filter(review => review.product.id === product.id);
                                const rating = productReviews.length > 0 ?
                                    productReviews.map(review => review.rating).reduce((a, b) => a + b) / productReviews.length :
                                    0;
                                return { ...product, rating };
                            });
                            return productsWithRating.sort((a, b) => b.rating - a.rating);
                        })
                    );
            }
            case '-price':
                return of(this.products.sort((a, b) => a.price - b.price));
            default:
                return of(this.products);
        }
    }
}
