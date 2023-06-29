import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateProductDto, ProductDto } from "@superstore/interfaces";
import { NotificationsService } from "../shared/notifications/notifications.service";
import { ReviewService } from "../review/review.service";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productUri = environment.productUri();
    products = new BehaviorSubject(<ProductDto[]>[]);

    constructor(
        private readonly http: HttpClient,
        private readonly notificationService: NotificationsService,
        private readonly reviewService: ReviewService,
    ) {
        this.getProducts(300, 1).subscribe();
    }

    addProduct(product: CreateProductDto): Observable<ProductDto> {
        return this.http.post<ProductDto>(this.productUri, product)
            .pipe(
                tap((product) => {
                    this.products.next([...this.products.value, product]);
                    this.notificationService.showSuccessNotification('Success', 'Product added successfully');
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    getProducts(limit: number, page: number): Observable<{ products: ProductDto[], total: number }> {
        return this.http.get<{ products: ProductDto[], total: number }>(this.productUri, {
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
                    this.products.next(products);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    async sortProducts(products: ProductDto[], orderBy): Promise<ProductDto[]> {
        if (orderBy === 'lowestPrice') {
            return products.sort((a, b) => a.price - b.price);
        } else if (orderBy === 'highestPrice') {
            return products.sort((a, b) => b.price - a.price);
        } else if (orderBy === 'name') {
            return products.sort((a, b) => a.name.localeCompare(b.name));
        } else if (orderBy === 'reviews') {
            const reviews = await this.reviewService.getReviewsForAllProducts().toPromise();
            return products.sort((a, b) => {
                const aReviews = reviews.filter((r) => r.productId === a.id);
                const bReviews = reviews.filter((r) => r.productId === b.id);
                return bReviews.length - aReviews.length;
            });
        } else {
            return products;
        }
    }


    getProductFromSlug(slug: string): Observable<ProductDto> {
        return this.http.get<ProductDto>(`${ this.productUri }/slug/${ slug }`);
    }

    getProductFromId(productId: number): Observable<ProductDto> {
        return this.http.get<ProductDto>(`${ this.productUri }/${ productId }`);
    }

    getProductFromIds(ids: number[]): Observable<ProductDto[]> {
        return this.http.post<ProductDto[]>(`${ this.productUri }/get-by-ids`, { ids });
    }

    updateProduct(product: ProductDto): Observable<ProductDto> {
        return this.http.put<ProductDto>(`${ this.productUri }/${ product.id }`, product)
            .pipe(
                tap((product) => {
                    const products = this.products.value.map((p) => {
                        if (p.id === product.id) {
                            return product;
                        } else {
                            return p;
                        }
                    });
                    this.notificationService.showSuccessNotification('Success', 'Product updated successfully');
                    this.products.next(products);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    deleteProduct(productId: number): Observable<void> {
        return this.http.delete<void>(`${ this.productUri }/${ productId }`)
            .pipe(
                tap(() => {
                    this.notificationService.showSuccessNotification('Success', 'Product deleted successfully');
                    const products = this.products.value.filter((p) => p.id !== productId);
                    this.products.next(products);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }
}
