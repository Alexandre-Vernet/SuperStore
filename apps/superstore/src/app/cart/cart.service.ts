import { Injectable } from '@angular/core';
import { CartDto } from "@superstore/libs";
import { ProductService } from "../product/product.service";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cart: CartDto[] = [];

    constructor(
        private readonly productService: ProductService,
    ) {
        const localStorageCart: CartDto[] = JSON.parse(localStorage.getItem('cart'));
        if (localStorageCart) {
            this.cart = localStorageCart;
        }
    }

    addToCart(productId: number) {
        this.productService.getProductFromId(productId)
            .subscribe((product) => {
                // Check if the product is already in the cart
                const productInCart = this.cart.find(cartProduct => cartProduct.id === product.id);
                if (productInCart) {
                    productInCart.quantity++;
                    this.updateCartLocalStorage();
                    return;
                }

                this.cart.push({
                    ...product,
                    quantity: 1
                });
                this.updateCartLocalStorage();
            });
    }

    removeFromCart(product: CartDto): CartDto[] {
        this.cart = this.cart.filter(cartProduct => cartProduct.id !== product.id);
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

    updateQuantity(item: CartDto, quantityUpdated: number) {
        this.cart.find(cartProduct => cartProduct.id === item.id).quantity = quantityUpdated;
        this.updateCartLocalStorage();
    }
}
