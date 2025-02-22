import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReviewDto, UserDto } from '@superstore/interfaces';
import { ReviewService } from '../review.service';
import { AuthService } from '../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-review-description',
    templateUrl: './review-description.component.html',
    styleUrls: ['./review-description.component.scss']
})
export class ReviewDescriptionComponent implements OnInit, OnDestroy {
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
        private readonly authService: AuthService
    ) {
    }

    ngOnInit() {
        this.authService.user$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => this.user = user);

        this.reviewService.reviews$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((reviews) => {
                this.reviews = reviews;
                this.pagination.totalPage = Math.ceil(this.reviews.length / 10);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    deleteReview(reviewId: number) {
        this.reviewService.deleteReview(reviewId)
            .subscribe();
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
