import { Component, Input, OnInit } from '@angular/core';
import { ReviewDto, UserDto } from "@superstore/libs";
import { ReviewService } from "./review.service";
import { UserService } from "../user/user.service";

@Component({
    selector: 'superstore-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
    @Input() reviews: ReviewDto[];
    user: UserDto;

    constructor(
        private readonly reviewService: ReviewService,
        private readonly userService: UserService
    ) {
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
}
