import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { ReviewDto } from "@superstore/libs";

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    reviewUrl = environment.reviewUrl();

    constructor(
        private readonly http: HttpClient,
    ) {
    }

    getReviewsForProduct(productId: number): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product/${ productId }`);
    }

    getReviewsForAllProducts(): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product`);
    }
}
