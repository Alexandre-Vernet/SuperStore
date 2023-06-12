import { ReviewDto } from "@superstore/libs";
import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'superstore-review-stats',
    templateUrl: './review-stats.component.html',
    styleUrls: ['./review-stats.component.scss'],
})
export class ReviewStatsComponent implements OnInit {

    @Input() reviews: ReviewDto[];
    rating = [5, 4, 3, 2, 1].map(rating => ({ rating: rating, count: 0 }));

    ngOnInit() {
        this.getTotalReviews();
        this.reviews.forEach(review => {
            const ratingItem = this.rating.find(item => item.rating === review.rating);
            if (ratingItem) {
                ratingItem.count++;
            }
        });
    }

    getTotalReviews() {
        return this.reviews.length;
    }

    calculateSizeProgressBar(rating: number) {
        const totalReviews = this.getTotalReviews();
        if (totalReviews === 0) {
            return 'width: 0%';
        }
        const ratingItem = this.rating.find(item => item.rating === rating);
        const ratingCount = ratingItem ? ratingItem.count : 0;
        return `width: calc(${ ratingCount } / ${ totalReviews } * 100%)`;
    }

    calculatePercentage(rating: number) {
        const totalReviews = this.getTotalReviews();
        if (totalReviews === 0) {
            return '0%';
        }
        const ratingItem = this.rating.find(item => item.rating === rating);
        const ratingCount = ratingItem ? ratingItem.count : 0;
        const percentage = Math.round((ratingCount / totalReviews) * 100);
        return `${ percentage }%`;
    }
}
