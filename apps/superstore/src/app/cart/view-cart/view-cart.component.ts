import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-view-cart',
    templateUrl: './view-cart.component.html',
    styleUrls: ['./view-cart.component.scss'],
})
export class ViewCartComponent implements OnInit {

    cart: ProductDto[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {
    }

    ngOnInit() {
        this.cart = this.cartService.cart;
    }

    getPricePerItem(item: ProductDto): number {
        return item.price * item.quantity;
    }

    removeFromCart(product: ProductDto) {
        this.cart = this.cartService.removeFromCart(product);
    }

    subTotalPrice(): number {
        return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    shippingPrice(): number {
        if (this.subTotalPrice()) {
            return 20;
        } else {
            return 0;
        }
    }

    taxes(): number {
        return this.subTotalPrice() * 0.25;
    }

    totalPrice(): number {
        return this.shippingPrice() + this.taxes() + this.subTotalPrice();
    }

    updateQuantity(item: ProductDto, event: Event) {
        const quantityUpdated = Number((event.target as HTMLInputElement).value);
        this.cartService.updateQuantity(item, quantityUpdated);
    }
}
