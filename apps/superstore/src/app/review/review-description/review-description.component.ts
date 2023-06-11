import { Component, Input } from '@angular/core';
import { ReviewDto, UserDto } from "@superstore/libs";

@Component({
    selector: 'superstore-review-description',
    templateUrl: './review-description.component.html',
    styleUrls: ['./review-description.component.scss'],
})
export class ReviewDescriptionComponent {
    @Input() reviews: ReviewDto[];
    @Input() user = {} as UserDto;
}
