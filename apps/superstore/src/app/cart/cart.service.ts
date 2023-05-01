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
    }
}
