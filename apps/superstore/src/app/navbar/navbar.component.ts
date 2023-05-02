import { Component } from '@angular/core';
import { Product } from "../product/product";
import { CartService } from "../cart/cart.service";

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  {

    cart: Product[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {
    }

    getTotalItemsInCart(): number {
        return this.cartService.cart.length;
    }
}
