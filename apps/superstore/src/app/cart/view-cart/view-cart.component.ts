import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service";
import { Cart } from "../cart";
import { CartDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-view-cart',
    templateUrl: './view-cart.component.html',
    styleUrls: ['./view-cart.component.scss'],
})
export class ViewCartComponent implements OnInit {

    cart: CartDto[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {
    }

    ngOnInit() {
        this.cart = this.cartService.cart;
    }

    getPricePerItem(item: CartDto): number {
        return Cart.convertTwoDecimals(item.price * item.quantity);
    }

    removeFromCart(product: CartDto) {
        this.cart = this.cartService.removeFromCart(product);
    }

    subTotalPrice(): number {
        let total = 0;
        this.cart.map(item => {
            total += item.price * item.quantity;
        });
        return Cart.convertTwoDecimals(total);
    }

    shippingPrice(): number {
        if (this.subTotalPrice()) {
            return Cart.convertTwoDecimals(20);
        } else {
            return Cart.convertTwoDecimals(0);
        }
    }

    taxes(): number {
        return Cart.convertTwoDecimals(this.subTotalPrice() * 0.25);
    }

    totalPrice(): number {
        return Cart.convertTwoDecimals(this.shippingPrice() + this.taxes() + this.subTotalPrice());
    }

    updateQuantity(item: CartDto, event: Event) {
        const quantityUpdated = Number((event.target as HTMLInputElement).value);
        this.cartService.updateQuantity(item, quantityUpdated);
    }
}
