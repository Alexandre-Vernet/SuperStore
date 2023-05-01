import { Injectable } from '@angular/core';
import { Product } from "../product/product";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cart: Product[] = [];

    constructor() {
    }

    addToCart(product: Product) {
        this.cart.push(product);

        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    removeFromCart(product: Product): Product[] {
        this.cart = this.cart.filter(cartProduct => cartProduct.id !== product.id);

        localStorage.setItem('cart', JSON.stringify(this.cart));
        return this.cart;
    }
}
