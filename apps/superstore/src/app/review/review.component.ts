import { Component, Input, OnInit } from '@angular/core';
import { ProductDto, ReviewDto } from "@superstore/libs";
import { ReviewService } from "./review.service";

@Component({
    selector: 'superstore-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
    @Input() product = {} as ProductDto;
    reviews: ReviewDto[] = [];

    constructor(
        private readonly reviewService: ReviewService,
    ) {
    }

    ngOnInit() {
        this.reviewService.getReviewsForProduct(this.product.id)
            .subscribe(reviews => {
                this.reviewService.reviews.next(reviews);
                this.reviews = reviews;
            });
    }
}
