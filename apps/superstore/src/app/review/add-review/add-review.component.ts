import { Component, HostListener, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReviewService } from "../review.service";
import { AuthService } from "../../auth/auth.service";
import { ProductDto } from "@superstore/libs";

@Component({
    selector: 'superstore-add-review',
    templateUrl: './add-review.component.html',
    styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent {
    @Input() productToReview = {} as ProductDto;
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
                productId: this.productToReview.id,
                userId: this.authService.user.id,
                rating: Number(rating),
                description,
            })
            .subscribe(() => this.closeModal());
    }

    closeModal() {
        this.reviewService.closeAddReviewModal();
    }

    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModal();
    }
}
