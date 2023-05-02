import { Injectable } from '@angular/core';
import { Product } from "../product/product";
import { Cart } from "./cart";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cart: Cart[] = [];

    constructor() {
    }

    addToCart(product: Product) {
        // Check if the product is already in the cart
        const productInCart = this.cart.find(cartProduct => cartProduct.id === product.id);
        if (productInCart) {
            productInCart.quantity++;
            console.log(this.cart);
            this.updateCartLocalStorage();
            return;
        }
        this.cart.push({
            ...product,
            quantity: 1
        });
        this.updateCartLocalStorage();
    }

    removeFromCart(product: Product): Cart[] {
        this.cart = this.cart.filter(cartProduct => cartProduct.id !== product.id);
        this.updateCartLocalStorage();
        return this.cart;
    }

    updateCartLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateQuantity(item: Cart, quantityUpdated: number) {
        this.cart.find(cartProduct => cartProduct.id === item.id).quantity = quantityUpdated;
        this.updateCartLocalStorage();
    }
}
