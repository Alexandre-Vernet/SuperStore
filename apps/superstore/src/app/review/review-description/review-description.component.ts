import { Component, Input } from '@angular/core';
import { ReviewDto, UserDto } from "@superstore/libs";
import { ReviewService } from "../review.service";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'superstore-review-description',
    templateUrl: './review-description.component.html',
    styleUrls: ['./review-description.component.scss'],
})
export class ReviewDescriptionComponent {
    @Input() reviews: ReviewDto[];
    @Input() user = {} as UserDto;
    userLogged = {} as UserDto;

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService,
    ) {
        this.userLogged = this.authService.user;
    }

    deleteReview(reviewId: number) {
        this.reviewService.deleteReview(reviewId).subscribe(() => {
            this.reviews = this.reviews.filter(review => review.id !== reviewId);
        });
    }
}
