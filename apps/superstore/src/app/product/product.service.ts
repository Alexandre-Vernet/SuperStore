import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "./product";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    productUri = `${ environment.backendUrl }/product`;

    constructor(
        private readonly http: HttpClient,
    ) {
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.productUri);
    }

    getProductFromSlug(slug: string): Observable<Product> {
        return this.http.get<Product>(`${ this.productUri }/slug/${ slug }`);
    }
}
