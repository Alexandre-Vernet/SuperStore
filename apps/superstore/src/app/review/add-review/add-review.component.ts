import { Component, HostListener, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReviewService } from "../review.service";
import { AuthService } from "../../auth/auth.service";
import { ProductDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-add-review',
    templateUrl: './add-review.component.html',
    styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent {
    @Input() productToReview: ProductDto;
    formAddReview = new FormGroup({
        rating: new FormControl('', Validators.required),
        description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    });
    highlightedRating = 0;

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService,
    ) {
    }

    setRating(rating: number) {
        this.formAddReview.patchValue({ rating: rating.toString() });
    }

    highlightRating(number: number) {
        this.highlightedRating = number;
    }


    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModal();
    }

    submitForm() {
        const { rating, description } = this.formAddReview.value;
        this.reviewService
            .addReview({
                product: this.productToReview,
                user: this.authService.user,
                rating: Number(rating),
                description,
                createdAt: new Date(),
            })
            .subscribe({
                next: () => this.closeModal(),
                error: (e) => {
                    this.formAddReview.setErrors({ error: e.error.message });
                }
            });
    }

    closeModal() {
        this.reviewService.closeAddReviewModal();
    }
}
