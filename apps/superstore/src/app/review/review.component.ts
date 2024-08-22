import { Component, Input, OnInit } from '@angular/core';
import { ProductDto, ReviewDto } from '@superstore/interfaces';
import { ReviewService } from './review.service';

@Component({
    selector: 'superstore-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
    @Input() product: ProductDto;
    reviews: ReviewDto[] = [];

    constructor(
        private readonly reviewService: ReviewService
    ) {
    }

    ngOnInit() {
        this.reviewService.getReviewsForProduct(this.product)
            .subscribe(reviews => this.reviews = reviews);
    }
}
