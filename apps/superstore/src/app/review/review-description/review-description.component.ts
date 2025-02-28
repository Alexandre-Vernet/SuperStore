import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductDto, ReviewDto, UserDto } from '@superstore/interfaces';
import { ReviewService } from '../review.service';
import { AuthService } from '../../auth/auth.service';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-review-description',
    templateUrl: './review-description.component.html',
    styleUrls: ['./review-description.component.scss']
})
export class ReviewDescriptionComponent implements OnInit, OnDestroy {
    @Input() product: ProductDto;
    @Input() showTotalReviews: boolean;
    reviews: ReviewDto[] = [];
    user: UserDto;

    pagination = {
        currentPage: 1,
        totalPage: 1,
        countItemPerPage: 10
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        combineLatest([this.authService.user$, this.reviewService.findReviewsForProduct(this.product)])
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(([user, reviews]) => {
                this.user = user;
                this.reviews = reviews;
                this.pagination.totalPage = Math.ceil(reviews.length / 10);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    deleteReview(review: ReviewDto) {
        this.reviewService.deleteReview(review)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
                next: () => {
                    this.notificationService.showSuccessNotification('Success', 'Review deleted successfully');
                    this.reviews = this.reviews.filter((r) => r.id !== review.id);
                }
            });
    }

    previousPage() {
        if (this.pagination.currentPage > 1) {
            this.pagination.currentPage--;
        }
    }

    nextPage() {
        if (this.pagination.currentPage < this.pagination.totalPage) {
            this.pagination.currentPage++;
        }
    }
}
