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
        this.updateCartLocalStorage();
    }

    removeFromCart(product: Product): Product[] {
        this.cart = this.cart.filter(cartProduct => cartProduct.id !== product.id);
        this.updateCartLocalStorage();
        return this.cart;
    }

    updateCartLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}
