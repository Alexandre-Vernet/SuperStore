import { Component, Input, OnInit } from '@angular/core';
import { ReviewDto } from "@superstore/libs";

@Component({
    selector: 'superstore-review-stars',
    templateUrl: './review-stars.component.html',
    styleUrls: ['./review-stars.component.scss'],
})
export class ReviewStarsComponent implements OnInit {
    @Input() review = {} as ReviewDto;
    @Input() reviews: ReviewDto[];
    stars: number[] = [1, 2, 3, 4, 5];

    ngOnInit() {
        this.getStarsForOneReview();
        this.getStarsForAllReview();
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
        if (!this.reviews || this.reviews.length === 0) {
            return;
        }

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
    }

    getTotalReviews() {
        return this.reviews?.length;
    }
}
