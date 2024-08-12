import { Component, HostListener, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { OrderDto, OrderState, ProductDto } from '@superstore/interfaces';
import { CartService } from '../../cart/cart.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ReviewService } from '../../review/review.service';
import { PdfService } from '../../shared/pdf/pdf.service';

@Component({
    selector: 'superstore-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
    orders: OrderDto[];
    displayOrderOptions = false;
    productToReview: ProductDto;

    constructor(
        private readonly orderService: OrderService,
        private readonly cartService: CartService,
        private readonly notificationsService: NotificationsService,
        readonly reviewService: ReviewService,
        private readonly pdfService: PdfService,
    ) {
    }

    ngOnInit() {
        this.orderService.getUserOrders()
            .subscribe((orders) => {
                console.log(orders)
                this.orders = orders;
            });
    }

    toggleOrderOption() {
        this.displayOrderOptions = !this.displayOrderOptions;
    }

    toggleAddReviewModal(product: ProductDto) {
        this.productToReview = product;
        this.reviewService.openAddReviewModal();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const menuElement = document.getElementById('menu');

        if (menuElement && !menuElement.contains(clickedElement)) {
            this.displayOrderOptions = false;
        }
    }

    getOrderStateImageFileName(state: OrderState): string {
        return `assets/order-state/${ state.toLowerCase() }.png`;
    }

    downloadInvoice(order: OrderDto) {
        return this.pdfService.downloadInvoice(order);
    }

    addToCart(product: ProductDto) {
        product.size = {
            name: 'Small',
            tag: 'S',
        };
        this.cartService.addToCart(product);
        this.notificationsService.showSuccessNotification('Success', 'Product added to cart');
    }
}
