import { Component, HostListener, OnInit } from '@angular/core';
import { OrderService } from "../order.service";
import { OrderState, OrderWithProductsDto, ProductDto } from "@superstore/libs";
import { ProductService } from "../../product/product.service";
import { ProductPipe } from "../../product/product.pipe";
import { CartService } from "../../cart/cart.service";
import { NotificationsService } from "../../shared/notifications/notifications.service";

@Component({
    selector: 'superstore-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {

    orders: OrderWithProductsDto[];
    displayOrderOptions = false;

    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly notificationsService: NotificationsService
    ) {
    }

    ngOnInit() {
        this.orderService.getOrders()
            .subscribe((orders) => {
                orders.map((order) => {
                    this.productService.getProductFromIds(order.productsId)
                        .subscribe((products) => {
                            order.products = products;
                            delete order.productsId;
                        });
                });
                this.orders = orders;
            });
    }

    toggleOrderOption() {
        this.displayOrderOptions = !this.displayOrderOptions;
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

    addToCart(product: ProductDto) {
        this.cartService.addToCart(product);
        this.notificationsService.showSuccessNotification('Product added to cart', '${ product.name } has been added to your cart.');
    }
}
