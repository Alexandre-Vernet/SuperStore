import { ProductDto } from '@superstore/interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../review.service';

@Component({
    selector: 'superstore-review-stats',
    templateUrl: './review-stats.component.html',
    styleUrls: ['./review-stats.component.scss']
})
export class ReviewStatsComponent implements OnInit {

    @Input() product: ProductDto;
    rating = [5, 4, 3, 2, 1].map(rating => ({ rating: rating, count: 0 }));
    totalReviews: number;

    constructor(
        private readonly reviewService: ReviewService
    ) {
    }

    ngOnInit() {
        this.reviewService.findAllReviews()
            .subscribe(reviews => {
                this.totalReviews = reviews.length;
                this.rating.forEach(rating => rating.count = 0);
                reviews.forEach(review => {
                    const ratingItem = this.rating.find(item => item.rating === review.rating);
                    if (ratingItem) {
                        ratingItem.count++;
                    }
                });
            });
    }

    calculateSizeProgressBar(rating: number) {
        const totalReviews = this.totalReviews;
        if (totalReviews === 0) {
            return 'width: 0%';
        }
        const ratingItem = this.rating.find(item => item.rating === rating);
        const ratingCount = ratingItem ? ratingItem.count : 0;
        return `width: calc(${ ratingCount } / ${ totalReviews } * 100%)`;
    }

    calculatePercentage(rating: number) {
        const totalReviews = this.totalReviews;
        if (totalReviews === 0) {
            return '0%';
        }
        const ratingItem = this.rating.find(item => item.rating === rating);
        const ratingCount = ratingItem ? ratingItem.count : 0;
        const percentage = Math.round((ratingCount / totalReviews) * 100);
        return `${ percentage }%`;
    }
}
