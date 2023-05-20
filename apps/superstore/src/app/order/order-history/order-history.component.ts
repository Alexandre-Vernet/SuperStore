import { Component, OnInit } from '@angular/core';
import { OrderService } from "../order.service";
import { NotificationType, OrderDto, OrderState, ProductDto } from "@superstore/libs";
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

    orders: OrderDto[];
    products: ProductDto[];

    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly cartService: CartService,
        private readonly notificationService: NotificationsService
    ) {
    }

    ngOnInit() {
        this.orderService.getOrders()
            .subscribe((orders) => {
                this.orders = orders;
                this.orders.forEach((order) => {
                    order.productsId.forEach((product) => {
                        this.getProductFromProductId(product)
                            .subscribe((product) => {
                                if (!this.products) {
                                    this.products = [];
                                }
                                this.products.push(product);
                            });
                    });
                });
            });
    }

    getProductFromProductId(productId: number) {
        return this.productService.getProduct(productId);
    }

    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    getOrderStateImageFileName(state: OrderState): string {
        return `assets/order-state/${ state.toLowerCase() }.png`;
    }

    addToCart(product: ProductDto) {
        this.cartService.addToCart(product);
        this.notificationService.message.emit({
            icon: 'success' as NotificationType,
            title: 'Product added to cart',
            description: `${ product.name } has been added to your cart`,
            show: true
        });
    }
}
