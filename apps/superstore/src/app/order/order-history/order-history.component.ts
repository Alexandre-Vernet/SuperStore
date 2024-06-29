import { Component, HostListener, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { OrderProductDto, OrderState, ProductDto, ProductSizeDto } from '@superstore/interfaces';
import { ProductService } from '../../product/product.service';
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
    orders: OrderProductDto[];
    displayOrderOptions = false;
    productToReview: ProductDto;

    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly notificationsService: NotificationsService,
        readonly reviewService: ReviewService,
        private readonly pdfService: PdfService,
    ) {
    }

    ngOnInit() {
        const ordersWithProducts: OrderProductDto[] = [];
        this.orderService.getOrdersPerUser()
            .subscribe((orders) => {
                orders.map((order) => {
                    this.productService.getProductFromIds(order.products.map(product => product.id))
                        .subscribe(product => {
                            ordersWithProducts.push({
                                ...order,
                                productIds: product.map(product => product.id),
                            });
                        });
                });
                this.orders = ordersWithProducts;
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

    downloadInvoice(order: OrderProductDto) {
        return this.pdfService.downloadInvoice(order);
    }

    addToCart(productId: number) {
        const defaultSize: ProductSizeDto = {
            name: 'Small',
            tag: 'S',
        };
        this.cartService.addToCart(productId, defaultSize);
        this.notificationsService.showSuccessNotification('Success', 'Product added to cart');
    }
}
