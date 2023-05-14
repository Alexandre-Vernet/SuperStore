import { Injectable } from '@angular/core';
import { CartDto, CreateOrderDto, NotificationsDto, ProductDto } from "@superstore/libs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    orderUri = environment.orderUri();
    cart: CartDto[] = [];

    constructor(
        private http: HttpClient
    ) {
    }

    addToCart(product: ProductDto) {
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

    confirmOrder(order: CreateOrderDto): Observable<NotificationsDto> {
        return this.http.post<NotificationsDto>(this.orderUri, order)
            .pipe(
                tap(() => this.clearCart())
            )
    }
}
