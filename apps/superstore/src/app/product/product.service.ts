import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import { Product } from "./product";
import { environment } from "../../environments/environment";
import { ProductDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productUri = `${ environment.backendUrl }/product`;

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
                    products: products.map(product => ({
                        ...product,
                        price: Product.convertCentToEuro(product.price)
                    })),
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
        return this.http.get<ProductDto>(`${ this.productUri }/slug/${ slug }`)
            .pipe(
                tap((product) => {
                    product.price = Product.convertCentToEuro(product.price);
                })
            );
    }
}
