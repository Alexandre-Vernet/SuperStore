import { Component, Input, OnInit } from '@angular/core';
import { ReviewWithUserDto, UserDto } from "@superstore/libs";
import { ReviewService } from "../review.service";
import { AuthService } from "../../auth/auth.service";
import { UserService } from "../../user/user.service";

@Component({
    selector: 'superstore-review-description',
    templateUrl: './review-description.component.html',
    styleUrls: ['./review-description.component.scss'],
})
export class ReviewDescriptionComponent implements OnInit {
    @Input() showTotalReviews;
    reviews: ReviewWithUserDto[] = [];
    currentUser = {} as UserDto;

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        this.currentUser = this.authService.user;
    }

    ngOnInit() {
        this.reviewService.reviews
            .subscribe((reviews) => {
                this.reviews = [];
                reviews.forEach(review => {
                    this.userService.getUser(review.userId)
                        .subscribe(user => {
                            this.reviews.push({
                                ...review,
                                user
                            });
                        });
                });
            });
    }

    deleteReview(reviewId: number) {
        this.reviewService.deleteReview(reviewId)
            .subscribe();
    }
}
