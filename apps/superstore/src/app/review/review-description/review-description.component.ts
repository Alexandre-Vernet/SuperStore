import { Component, Input, OnInit } from '@angular/core';
import { ReviewDto, UserDto } from '@superstore/interfaces';
import { ReviewService } from '../review.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'superstore-review-description',
    templateUrl: './review-description.component.html',
    styleUrls: ['./review-description.component.scss']
})
export class ReviewDescriptionComponent implements OnInit {
    @Input() showTotalReviews: boolean;
    reviews: ReviewDto[] = [];
    currentUser: UserDto;
    currentPage = 1;
    totalPage = 1;
    countItemPerPage = 10;

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService
    ) {
        this.currentUser = this.authService.user;
    }

    ngOnInit() {
        this.reviewService.reviews$
            .subscribe((reviews) => {
                this.reviews = reviews;
                this.totalPage = Math.ceil(this.reviews.length / 10);
            });
    }


    deleteReview(reviewId: number) {
        this.reviewService.deleteReview(reviewId)
            .subscribe();
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPage) {
            this.currentPage++;
        }
    }
}
