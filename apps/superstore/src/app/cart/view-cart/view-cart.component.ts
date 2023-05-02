import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service";
import { Product } from "../../product/product";
import { ProductProductPipe } from "../../product/product.pipe";
import { Cart } from "../cart";

@Component({
    selector: 'superstore-view-cart',
    templateUrl: './view-cart.component.html',
    styleUrls: ['./view-cart.component.scss'],
})
export class ViewCartComponent implements OnInit {

    cart: Cart[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {
        const localStorageCart: Cart[] = JSON.parse(localStorage.getItem('cart'));
        if (localStorageCart) {
            this.cartService.cart = localStorageCart;
        }
    }

    ngOnInit() {
        this.cart = this.cartService.cart;
    }

    removeFromCart(product: Product) {
        this.cart = this.cartService.removeFromCart(product);
    }

    subTotalPrice(): number {
        let total = 0;
        this.cart.forEach(item => {
            total += item.price * item.quantity;
        });
        return total;
    }

    shippingCost(): number {
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
        return this.shippingCost() + this.taxes() + this.subTotalPrice();
    }

    convertProductNameToSlug(name: string): string {
        return new ProductProductPipe().convertProductNameToSlug(name);
    }

    updateQuantity(item: Cart, event) {
        const quantityUpdated: number = event.target.value;
        console.log(quantityUpdated)
        this.cartService.updateQuantity(item, quantityUpdated);
    }
}
