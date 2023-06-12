import { Component } from '@angular/core';
import { CartService } from "../../../cart/cart.service";

@Component({
    selector: 'superstore-cart-icon',
    templateUrl: './cart-icon.component.html',
    styleUrls: ['./cart-icon.component.scss'],
})
export class CartIconComponent {

    constructor(
        private readonly cartService: CartService,
    ) {
    }

    getTotalItemsInCart(): number {
        return this.cartService.cart.length;
    }
}
