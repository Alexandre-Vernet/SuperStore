import { Injectable } from '@angular/core';
import { Cart } from "./cart";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cart: Cart[] = [];

    constructor() {
    }

    addToCart(product: Cart) {
        this.cart.push(product);
    }
}
