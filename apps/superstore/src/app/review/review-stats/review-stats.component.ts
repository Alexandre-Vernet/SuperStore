import { ProductDto } from "@superstore/libs";
import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { ReviewService } from "../review.service";
import { OrderService } from "../../order/order.service";

@Component({
    selector: 'superstore-review-stats',
    templateUrl: './review-stats.component.html',
    styleUrls: ['./review-stats.component.scss'],
})
export class ReviewStatsComponent implements OnInit {

    @Input() product = {} as ProductDto;
    rating = [5, 4, 3, 2, 1].map(rating => ({ rating: rating, count: 0 }));
    userCanAddReview: boolean;

    constructor(
        readonly reviewService: ReviewService,
        private readonly authService: AuthService,
        private readonly orderService: OrderService
    ) {
    }

    ngOnInit() {
        this.getTotalReviews();
        this.reviewService.reviews
            .subscribe(reviews => {
                this.rating.forEach(rating => rating.count = 0);
                reviews.forEach(review => {
                    const ratingItem = this.rating.find(item => item.rating === review.rating);
                    if (ratingItem) {
                        ratingItem.count++;
                    }
                });
            })

        this.userHasBoughtProduct();
    }

    getTotalReviews() {
        return this.reviewService.reviews.value.length;
    }

    calculateSizeProgressBar(rating: number) {
        const totalReviews = this.getTotalReviews();
        if (totalReviews === 0) {
            return 'width: 0%';
        }
        const ratingItem = this.rating.find(item => item.rating === rating);
        const ratingCount = ratingItem ? ratingItem.count : 0;
        return `width: calc(${ ratingCount } / ${ totalReviews } * 100%)`;
    }

    calculatePercentage(rating: number) {
        const totalReviews = this.getTotalReviews();
        if (totalReviews === 0) {
            return '0%';
        }
        const ratingItem = this.rating.find(item => item.rating === rating);
        const ratingCount = ratingItem ? ratingItem.count : 0;
        const percentage = Math.round((ratingCount / totalReviews) * 100);
        return `${ percentage }%`;
    }


    userHasBoughtProduct() {
        this.orderService.getOrdersPerUser()
            .subscribe(orders => {
                const userHasBoughtProduct = orders.find(order => order.productsId.find(productId => productId === this.product?.id));
                const userHasAlreadyReviewedProduct = this.reviewService.reviews.value.find(review => review.userId === this.authService.user?.id && review.productId === this.product?.id);
                this.userCanAddReview = userHasBoughtProduct && !userHasAlreadyReviewedProduct;
            });
    }

    toggleAddReviewModal() {
        this.reviewService.openAddReviewModal();
    }
}
