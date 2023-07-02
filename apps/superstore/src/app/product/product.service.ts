import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, tap } from "rxjs";
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
    productsFiltered = new BehaviorSubject(<ProductDto[]>[]);

    constructor(
        private readonly http: HttpClient,
        private readonly notificationService: NotificationsService,
        private readonly reviewService: ReviewService,
    ) {
        this.getAllProducts().subscribe();
    }

    addProduct(product: CreateProductDto): Observable<ProductDto> {
        return this.http.post<ProductDto>(this.productUri, product)
            .pipe(
                tap((product) => {
                    this.products.next([...this.products.value, product]);
                    this.productsFiltered.next([...this.productsFiltered.value, product]);
                    this.notificationService.showSuccessNotification('Success', 'Product added successfully');
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    getAllProducts(): Observable<ProductDto[]> {
        return this.http.get<ProductDto[]>(this.productUri)
            .pipe(
                tap((products) => {
                    this.products.next(products);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
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
                    this.products.next(products);
                    this.productsFiltered.next(products);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    async sortProducts(orderBy: string): Promise<ProductDto[]> {
        switch (orderBy) {
            case 'price':
                return this.productsFiltered.value.sort((a, b) => a.price - b.price);
            case '-price':
                return this.productsFiltered.value.sort((a, b) => b.price - a.price);
            case 'name':
                return this.productsFiltered.value.sort((a, b) => a.name.localeCompare(b.name));
            case '-name':
                return this.productsFiltered.value.sort((a, b) => b.name.localeCompare(a.name));
            case '-rating':
                const reviews = await lastValueFrom(this.reviewService.getReviewsForAllProducts());
                return this.productsFiltered.value.sort((a, b) => {
                    const aReviews = reviews.filter((r) => r.productId === a.id);
                    const bReviews = reviews.filter((r) => r.productId === b.id);
                    const aRating = aReviews.reduce((acc, cur) => acc + cur.rating, 0) / aReviews.length;
                    const bRating = bReviews.reduce((acc, cur) => acc + cur.rating, 0) / bReviews.length;
                    return bRating - aRating;
                });
            default:
                return this.productsFiltered.value;
        }
    }

    async sortProductsByPrice(label: string): Promise<ProductDto[]> {
        let products: ProductDto[] = [];
        this.productsFiltered.next(this.products.value);
        switch (label) {
            case 'under-25':
                products = this.productsFiltered.value.filter((p) => p.price < 25);
                break;
            case '25-to-50':
                products = this.productsFiltered.value.filter((p) => p.price >= 25 && p.price < 50);
                break;
            case '50-to-100':
                products = this.productsFiltered.value.filter((p) => p.price >= 50 && p.price < 100);
                break;
            case '100-to-200':
                products = this.productsFiltered.value.filter((p) => p.price >= 100 && p.price < 200);
                break;
            case '200-and-above':
                products = this.productsFiltered.value.filter((p) => p.price >= 200);
                break;
            default:
                return this.productsFiltered.value;
        }

        this.productsFiltered.next(products);
        return products;
    }

    resetFilters(): void {
        this.productsFiltered.next(this.products.value);
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
                    this.productsFiltered.next(products);
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }
}
