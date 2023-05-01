import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service";
import { Product } from "../../product/product";
import { ProductProductPipe } from "../../product/product.pipe";

@Component({
    selector: 'superstore-view-cart',
    templateUrl: './view-cart.component.html',
    styleUrls: ['./view-cart.component.scss'],
})
export class ViewCartComponent implements OnInit {

    cart: Product[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {
        const localStorageCart: Product[] = JSON.parse(localStorage.getItem('cart'));
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
        return this.cart.map(product => product.price).reduce((a, b) => a + b, 0);
    }

    shippingCost(): number {
        return 20;
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
}
