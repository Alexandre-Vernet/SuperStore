import { Injectable } from '@angular/core';
import { ProductDto } from '@superstore/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cart: ProductDto[] = [];

    constructor() {
        const localStorageCart: ProductDto[] = JSON.parse(localStorage.getItem('cart'));
        if (localStorageCart) {
            this.cart = localStorageCart;
        }
    }

    addToCart(product: ProductDto) {
        // Check if the product is already in the cart
        const productInCart = this.cart.find(cart => cart.id === product.id && cart.size === product.size);
        if (productInCart) {
            productInCart.quantity++;
            this.updateCartLocalStorage();
        } else {
            product.quantity = 1;
            this.cart.push(product);
            this.updateCartLocalStorage();
        }
    }

    removeFromCart(product: ProductDto): ProductDto[] {
        this.cart = this.cart.filter(cartProduct => cartProduct.id !== product.id || cartProduct.size !== product.size);
        this.updateCartLocalStorage();
        return this.cart;
    }

    clearCart() {
        this.cart = [];
        this.updateCartLocalStorage();
    }

    updateCartLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateQuantity(item: ProductDto, quantityUpdated: number) {
        const product = this.cart.find(cartProduct => cartProduct.id === item.id && cartProduct.size === item.size);
        product.quantity = quantityUpdated;
        this.updateCartLocalStorage();
    }
}
