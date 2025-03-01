import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../review.service';
import { AuthService } from '../../auth/auth.service';
import { ProductDto, UserDto } from '@superstore/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
    selector: 'superstore-add-review',
    templateUrl: './add-review.component.html',
    styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent implements OnInit{
    @Input() product: ProductDto;

    user: UserDto;

    formAddReview = new FormGroup({
        rating: new FormControl('', Validators.required),
        description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    });
    highlightedRating = 0;

    showModalAddReview = false;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly reviewService: ReviewService,
        private readonly authService: AuthService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        this.authService.user$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => this.user = user);
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
                product: this.product,
                user: this.user,
                rating: Number(rating),
                description,
                createdAt: new Date(),
            })
            .subscribe({
                next: () => {
                    this.notificationService.showSuccessNotification('Success', 'Review added successfully');
                    this.closeModal();
                },
                error: (e) => this.formAddReview.setErrors({ error: e.error.message ?? 'An error has occurred' })
            });
    }

    closeModal() {
        this.showModalAddReview = false;
    }
}
