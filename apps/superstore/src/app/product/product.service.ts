import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDto } from '@superstore/interfaces';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ReviewService } from '../review/review.service';
import { ErrorService } from '../error/error.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productUri = environment.productUri();
    private productsSubject = new BehaviorSubject(<ProductDto[]>[]);
    private productsSubjectFiltered = new BehaviorSubject(<ProductDto[]>[]);
    products$ = this.productsSubject.asObservable();
    productsFilter$ = this.productsSubjectFiltered.asObservable();

    constructor(
        private readonly http: HttpClient,
        private readonly notificationService: NotificationsService,
        private readonly reviewService: ReviewService,
        private readonly errorService: ErrorService
    ) {
        this.getAllProducts().subscribe();
    }

    addProduct(product: ProductDto): Observable<ProductDto> {
        return this.http.post<ProductDto>(this.productUri, product)
            .pipe(
                tap((product) => {
                    this.productsSubject.next([...this.productsSubject.value, product]);
                    this.productsSubjectFiltered.next([...this.productsSubjectFiltered.value, product]);
                    this.notificationService.showSuccessNotification('Success', 'Product added successfully');
                })
            );
    }

    getAllProducts(): Observable<ProductDto[]> {
        return this.http.get<ProductDto[]>(this.productUri)
            .pipe(
                tap((products) => this.productsSubject.next(products)),
                tap((products) => this.productsSubjectFiltered.next(products))
            );
    }

    sortProducts(sortBy: string, priceRange: string, category: string) {
        let filteredProducts = [...this.productsSubject.value];

        if (sortBy) {
            this.filterProductsByLabel(sortBy, filteredProducts)
                .pipe(
                    map(sortedProducts => {
                        filteredProducts = sortedProducts;
                        return filteredProducts;
                    }),
                    switchMap(() => {
                        if (category) {
                            filteredProducts = this.filterProductsByCategory(category, filteredProducts);
                        }
                        if (priceRange) {
                            filteredProducts = this.filterByPriceRange(priceRange, filteredProducts);
                        }
                        return of(filteredProducts);
                    })
                )
                .subscribe(finalFilteredProducts => this.productsSubjectFiltered.next(finalFilteredProducts));
        } else {
            if (category) {
                filteredProducts = this.filterProductsByCategory(category, filteredProducts);
            }

            if (priceRange) {
                filteredProducts = this.filterByPriceRange(priceRange, filteredProducts);
            }

            this.productsSubjectFiltered.next(filteredProducts);
        }
    }

    private filterProductsByCategory(category: string, filteredProducts: ProductDto[]) {
        return filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    private filterByPriceRange(priceRange: string, filteredProducts: ProductDto[]) {
        switch (priceRange) {
            case '25-to-50':
                return filteredProducts.filter((p) => p.price >= 25 && p.price < 50);
            case '50-to-100':
                return filteredProducts.filter((p) => p.price >= 50 && p.price < 100);
            case '100-to-200':
                return filteredProducts.filter((p) => p.price >= 100 && p.price < 200);
            case '200-and-above':
                return filteredProducts.filter((p) => p.price >= 200);
            case 'under-25':
            default:
                return filteredProducts.filter((p) => p.price < 25);
        }
    }

    private filterProductsByLabel(label: string, filteredProducts: ProductDto[]): Observable<ProductDto[]> {
        switch (label) {
            case '+price':
                return of(filteredProducts.sort((a, b) => b.price - a.price));
            case '+name':
                return of(filteredProducts.sort((a, b) => a.name.localeCompare(b.name)));
            case '-name':
                return of(filteredProducts.sort((a, b) => b.name.localeCompare(a.name)));
            case '+rating': {
                return this.reviewService.getReviewsForAllProducts().pipe(
                    map(reviews => {
                        const productsWithRating = filteredProducts.map(product => {
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
            default:
                return of(filteredProducts.sort((a, b) => a.price - b.price));
        }
    }

    resetFilters() {
        this.productsSubjectFiltered.next(this.productsSubject.value);
    }

    getProductFromSlug(slug: string): Observable<ProductDto> {
        return this.http.get<ProductDto>(`${ this.productUri }/slug/${ slug }`);
    }

    updateProduct(product: ProductDto): Observable<ProductDto> {
        return this.http.put<ProductDto>(`${ this.productUri }/${ product.id }`, product)
            .pipe(
                tap((updatedProduct) => {
                    const products = this.productsSubject.value.map(p =>
                        p.id === updatedProduct.id ? updatedProduct : p
                    );
                    this.productsSubject.next(products);
                    this.notificationService.showSuccessNotification('Success', 'Product updated successfully');
                })
            );
    }

    deleteProduct(productId: number): Observable<void> {
        return this.http.delete<void>(`${ this.productUri }/${ productId }`)
            .pipe(
                tap(() => {
                    const products = this.productsSubject.value.filter((p) => p.id !== productId);
                    this.productsSubject.next(products);
                    this.productsSubjectFiltered.next(products);
                    this.notificationService.showSuccessNotification('Success', 'Product deleted successfully');
                }),
                catchError((err) => {
                    this.errorService.setError(err.error.message);
                    return of(null);
                })
            );
    }
}
