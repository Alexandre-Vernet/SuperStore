import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDto } from '@superstore/interfaces';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ReviewService } from '../review/review.service';
import { ErrorService } from "../error/error.service";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productUri = environment.productUri();
    private productsSubject = new BehaviorSubject(<ProductDto[]>[]);
    private productsSubjectFiltered = new BehaviorSubject(<ProductDto[]>[]);
    products$ = this.productsSubject.asObservable();
    productsFiltered$ = this.productsSubjectFiltered.asObservable();

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
                }),
            );
    }

    getAllProducts(): Observable<ProductDto[]> {
        return this.http.get<ProductDto[]>(this.productUri)
            .pipe(
                tap((products) => {
                    this.productsSubject.next(products);
                }),
            );
    }

    getProducts(limit: number, page: number): Observable<{ products: ProductDto[], total: number }> {
        return this.http.get<{ products: ProductDto[], total: number }>(`${ this.productUri }/pagination`, {
            params: {
                limit,
                page: page,
            }
        })
            .pipe(
                map(({ products, total }) => ({
                    products,
                    total
                })),
                tap(({ products }) => {
                    this.productsSubject.next(products);
                    this.productsSubjectFiltered.next(products);
                }),
            );
    }

    async sortProducts(orderBy: string): Promise<ProductDto[]> {
        switch (orderBy) {
            case 'price':
                return this.productsSubjectFiltered.value.sort((a, b) => a.price - b.price);
            case '-price':
                return this.productsSubjectFiltered.value.sort((a, b) => b.price - a.price);
            case 'name':
                return this.productsSubjectFiltered.value.sort((a, b) => a.name.localeCompare(b.name));
            case '-name':
                return this.productsSubjectFiltered.value.sort((a, b) => b.name.localeCompare(a.name));
            case '-rating': {
                const reviews = await lastValueFrom(this.reviewService.getReviewsForAllProducts());
                return this.productsSubjectFiltered.value.sort((a, b) => {
                    const aReviews = reviews.filter((r) => r.product.id === b.id);
                    const bReviews = reviews.filter((r) => r.product.id === b.id);
                    const aRating = aReviews.reduce((acc, cur) => acc + cur.rating, 0) / aReviews.length;
                    const bRating = bReviews.reduce((acc, cur) => acc + cur.rating, 0) / bReviews.length;
                    return bRating - aRating;
                });
            }
            default:
                return this.productsSubjectFiltered.value;
        }
    }

    async sortProductsByPrice(label: string): Promise<ProductDto[]> {
        let products: ProductDto[] = [];
        this.productsSubjectFiltered.next(this.productsSubject.value);
        switch (label) {
            case 'under-25':
                products = this.productsSubjectFiltered.value.filter((p) => p.price < 25);
                break;
            case '25-to-50':
                products = this.productsSubjectFiltered.value.filter((p) => p.price >= 25 && p.price < 50);
                break;
            case '50-to-100':
                products = this.productsSubjectFiltered.value.filter((p) => p.price >= 50 && p.price < 100);
                break;
            case '100-to-200':
                products = this.productsSubjectFiltered.value.filter((p) => p.price >= 100 && p.price < 200);
                break;
            case '200-and-above':
                products = this.productsSubjectFiltered.value.filter((p) => p.price >= 200);
                break;
            default:
                return this.productsSubjectFiltered.value;
        }

        this.productsSubjectFiltered.next(products);
        return products;
    }

    filterProductsByCategory(category: string) {
        setTimeout(() =>  {
            const products = this.productsSubject.value.filter((p) => p.categories.includes(category));
            this.productsSubjectFiltered.next(products);
        }, 2000);
    }

    resetFilters(): void {
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
                }),
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
