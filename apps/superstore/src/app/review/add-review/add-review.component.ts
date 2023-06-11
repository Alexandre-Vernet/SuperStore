import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReviewService } from "../review.service";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'superstore-add-review',
    templateUrl: './add-review.component.html',
    styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent {
    formAddReview = new FormGroup({
        rating: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
    });

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService,
    ) {
    }

    setRating(rating: string) {
        this.formAddReview.patchValue({ rating });
    }

    submitForm() {
        const { rating, description } = this.formAddReview.value;
        this.reviewService
            .addReview({
                productId: 1,
                userId: this.authService.user.id,
                rating: Number(rating),
                description,
            })
            .subscribe(() => this.closeModal());
    }

    closeModal() {
        this.reviewService.closeAddReviewModal();
    }
}
