import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { ProductDto, ReviewDto } from '@superstore/interfaces';
import { NotificationsService } from '../shared/notifications/notifications.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    reviewUrl = environment.reviewUrl();
    private reviewsSubject = new BehaviorSubject(<ReviewDto[]>[]);

    constructor(
        private readonly http: HttpClient,
        private readonly notificationService: NotificationsService
    ) {
    }

    addReview(review: ReviewDto): Observable<ReviewDto> {
        return this.http.post<ReviewDto>(this.reviewUrl, review);
    }

    findReviewsForProduct(product: ProductDto): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product/${ product.id }`);
    }

    findAllReviews(): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product`);
    }

    deleteReview(review: ReviewDto): Observable<ReviewDto> {
        return this.http.delete<ReviewDto>(`${ this.reviewUrl }/${ review.id }`)
            .pipe(
                tap(() => {
                    const reviews = this.reviewsSubject.getValue();
                    const index = reviews.findIndex((r) => r.id === review.id);
                    reviews.splice(index, 1);
                    this.reviewsSubject.next(reviews);
                    this.notificationService.showSuccessNotification('Success', 'Review deleted successfully');
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    return of(null);
                })
            );
    }
}
