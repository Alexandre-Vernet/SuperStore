import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { ProductDto, ReviewDto } from '@superstore/interfaces';
import { NotificationsService } from '../shared/notifications/notifications.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    reviewUrl = environment.reviewUrl();
    private reviewsSubject = new BehaviorSubject(<ReviewDto[]>[]);
    reviews$: Observable<ReviewDto[]> = this.reviewsSubject.asObservable();
    showModalAddReview: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly http: HttpClient,
        private readonly notificationService: NotificationsService
    ) {
    }

    addReview(review: ReviewDto): Observable<ReviewDto> {
        return this.http.post<ReviewDto>(this.reviewUrl, review);
    }

    getReviewsForProduct(product: ProductDto): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product/${ product.id }`)
            .pipe(
                tap(reviews => this.reviewsSubject.next(reviews))
            );
    }

    getReviewsForAllProducts(): Observable<ReviewDto[]> {
        return this.http.get<ReviewDto[]>(`${ this.reviewUrl }/product`);
    }

    deleteReview(reviewId: number): Observable<ReviewDto> {
        return this.http.delete<ReviewDto>(`${ this.reviewUrl }/${ reviewId }`)
            .pipe(
                tap(() => {
                    const reviews = this.reviewsSubject.getValue();
                    const index = reviews.findIndex((review) => review.id === reviewId);
                    reviews.splice(index, 1);
                    this.reviewsSubject.next(reviews);
                    this.notificationService.showSuccessNotification('Success', 'Review deleted successfully');
                }),
                catchError((err) => {
                    this.notificationService.showErrorNotification('Error', err.error.message);
                    throw err;
                })
            );
    }

    openAddReviewModal() {
        this.showModalAddReview.next(true);
    }

    closeAddReviewModal() {
        this.showModalAddReview.next(false);
    }
}
