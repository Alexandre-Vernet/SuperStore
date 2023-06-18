import { Component, Input, OnInit } from '@angular/core';
import { ReviewDto } from "@superstore/interfaces";
import { ReviewService } from "../review.service";

@Component({
    selector: 'superstore-review-stars',
    templateUrl: './review-stars.component.html',
    styleUrls: ['./review-stars.component.scss'],
})
export class ReviewStarsComponent implements OnInit {
    @Input() showTotalReviews;
    @Input() review: ReviewDto;
    reviews: ReviewDto[] = [];
    stars: number[] = [1, 2, 3, 4, 5];

    constructor(
        private readonly reviewService: ReviewService,
    ) {
    }

    ngOnInit() {
        if (this.review) {
            this.getStarsForOneReview();
        } else {
            this.getStarsForAllReview();
        }
    }

    getStarsForOneReview() {
        this.stars = this.stars
            .map((star, index) => {
                if (index < this.review.rating) {
                    return 1;
                }
                return 0;
            });
    }

    getStarsForAllReview() {
        this.reviewService.reviews
            .subscribe(reviews => {
                this.reviews = reviews;
                const totalReview = this.reviews
                    .reduce((acc, review) => {
                        return acc + review.rating;
                    }, 0);


                // Around to the nearest whole number
                const averageRating = Math.round(totalReview / this.reviews.length);
                this.stars = this.stars
                    .map((star, index) => {
                        if (index < averageRating) {
                            return 1;
                        }

                        return 0;
                    });
            });
    }

    getTotalReviews() {
        return this.reviews.length;
    }
}
