import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ProductDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productUri = environment.productUri();

    constructor(
        private readonly http: HttpClient,
    ) {
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
                }))
            );
    }

    sortProducts(products: ProductDto[], orderBy): ProductDto[] {
        return products.sort((a, b) => {
            if (orderBy === 'lowestPrice') {
                return a.price - b.price;
            } else if (orderBy === 'highestPrice') {
                return b.price - a.price;
            } else if (orderBy === 'name') {
                return a.name.localeCompare(b.name);
            } else {
                return 0;
            }
        });

    }

    getProductFromSlug(slug: string): Observable<ProductDto> {
        return this.http.get<ProductDto>(`${ this.productUri }/slug/${ slug }`);
    }

    getProductFromIds(ids: number[]): Observable<ProductDto[]> {
        return this.http.post<ProductDto[]>(`${ this.productUri }/get-by-ids`, { ids });
    }

    getProduct(productId: number): Observable<ProductDto> {
        return this.http.get<ProductDto>(`${ this.productUri }/${ productId }`);
    }
}
