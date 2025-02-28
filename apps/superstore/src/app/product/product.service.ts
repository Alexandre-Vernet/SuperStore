import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDto } from '@superstore/interfaces';
import { ReviewService } from '../review/review.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productUri = environment.productUri();

    constructor(
        private readonly http: HttpClient,
        private readonly reviewService: ReviewService,
    ) {
    }

    addProduct(product: ProductDto): Observable<ProductDto> {
        return this.http.post<ProductDto>(this.productUri, product);
    }

    findAllProducts(): Observable<ProductDto[]> {
        return this.http.get<ProductDto[]>(this.productUri);
    }

    getProductFromSlug(slug: string): Observable<ProductDto> {
        return this.http.get<ProductDto>(`${ this.productUri }/slug/${ slug }`);
    }

    updateProduct(product: ProductDto): Observable<ProductDto> {
        return this.http.put<ProductDto>(`${ this.productUri }/${ product.id }`, product);
    }

    deleteProduct(productId: number): Observable<void> {
        return this.http.delete<void>(`${ this.productUri }/${ productId }`);
    }
}
