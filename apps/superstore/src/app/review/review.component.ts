import { Component, Input, OnInit } from '@angular/core';
import { ProductDto, ReviewDto } from '@superstore/interfaces';
import { ReviewService } from './review.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
    @Input() product: ProductDto;
    reviews: ReviewDto[] = [];

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly reviewService: ReviewService
    ) {
    }

    ngOnInit() {
        this.reviewService.findReviewsForProduct(this.product)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(reviews => this.reviews = reviews);
    }
}
