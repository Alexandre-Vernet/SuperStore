import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
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

    getProducts(): Observable<ProductDto[]> {
        return this.http.get<ProductDto[]>(this.productUri)
            .pipe(
                tap((products) => {
                    products.map(product => {
                        product.price = Product.convertCentToEuro(product.price);
                    });
                })
            );
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
