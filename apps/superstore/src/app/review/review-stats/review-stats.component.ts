import { Component, Input, OnInit } from '@angular/core';
import { ReviewDto } from "@superstore/libs";

@Component({
    selector: 'superstore-review-stats',
    templateUrl: './review-stats.component.html',
    styleUrls: ['./review-stats.component.scss'],
})
export class ReviewStatsComponent implements OnInit {

    @Input() reviews: ReviewDto[];
    rating: number[] = [0, 0, 0, 0, 0]; // Each index represents a star

    ngOnInit() {
        this.reviews.forEach(review => {
            this.rating[review.rating - 1]++;
        });
    }

    getTotalReviews() {
        return this.reviews.length;
    }

    calculateSizeProgressBar(rating: number) {
        const ratingIndex = this.rating[rating - 1];
        return `width: calc(${ ratingIndex } / ${ this.getTotalReviews() } * 100%)`;
    }

    calculatePercentage(rating: number) {
        const ratingIndex = this.rating[rating - 1];
        if (!ratingIndex) {
            return `0%`;
        }
        return `${ Math.round(ratingIndex / this.getTotalReviews() * 100) } %`;
    }

}
