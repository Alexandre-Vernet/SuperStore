import { Component, HostListener, OnInit } from '@angular/core';
import { OrderService } from "../order.service";
import { OrderState, OrderWithProductsDto, ProductDto, ProductSizeDto } from "@superstore/libs";
import { ProductService } from "../../product/product.service";
import { ProductPipe } from "../../product/product.pipe";
import { CartService } from "../../cart/cart.service";
import { NotificationsService } from "../../shared/notifications/notifications.service";
import { ReviewService } from "../../review/review.service";
import { PdfService } from "../../shared/pdf/pdf.service";

@Component({
    selector: 'superstore-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
    orders: OrderWithProductsDto[];
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
        const ordersWithProducts: OrderWithProductsDto[] = [];
        this.orderService.getOrdersPerUser()
            .subscribe((orders) => {
                orders.map((order) => {
                    this.productService.getProductFromIds(order.productsId)
                        .subscribe(product => {
                            ordersWithProducts.push({
                                ...order,
                                products: product,
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

    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    getOrderStateImageFileName(state: OrderState): string {
        return `assets/order-state/${ state.toLowerCase() }.png`;
    }

    downloadInvoice(order: OrderWithProductsDto) {
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
