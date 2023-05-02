import { Component } from '@angular/core';
import { CartService } from "../../cart/cart.service";
import { Cart } from "../../cart/cart";

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  {

    cart: Cart[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {
    }

    getTotalItemsInCart(): number {
        return this.cartService.cart.length;
    }
}
