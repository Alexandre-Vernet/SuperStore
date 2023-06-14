import { Component, Input, OnInit } from '@angular/core';
import { ReviewDto, UserDto } from "@superstore/libs";
import { ReviewService } from "../review.service";
import { AuthService } from "../../auth/auth.service";
import { UserService } from "../../user/user.service";

@Component({
    selector: 'superstore-review-description',
    templateUrl: './review-description.component.html',
    styleUrls: ['./review-description.component.scss'],
})
export class ReviewDescriptionComponent implements OnInit {
    @Input() reviews: ReviewDto[];
    userLogged = {} as UserDto;
    user: UserDto;

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        this.userLogged = this.authService.user;
    }

    ngOnInit() {
        this.reviews.forEach(review => {
            this.getUserFromId(review.userId);
        });
    }

    getUserFromId(userId: number) {
        this.userService.getUser(userId)
            .subscribe((user) => this.user = user)
    }

    deleteReview(reviewId: number) {
        this.reviewService.deleteReview(reviewId).subscribe(() => {
            this.reviews = this.reviews.filter(review => review.id !== reviewId);
        });
    }
}
