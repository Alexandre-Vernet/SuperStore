import { Component, Input } from '@angular/core';
import { ProductDto, ReviewDto } from "@superstore/libs";

@Component({
    selector: 'superstore-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
    @Input() reviews: ReviewDto[];
    @Input() product = {} as ProductDto;

    constructor() {
    }
}
