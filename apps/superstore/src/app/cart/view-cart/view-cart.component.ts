import { Component, OnInit } from '@angular/core';
import { CartService } from "../cart.service";
import { Product } from "../../product/product";

@Component({
    selector: 'superstore-view-cart',
    templateUrl: './view-cart.component.html',
    styleUrls: ['./view-cart.component.scss'],
})
export class ViewCartComponent implements OnInit {

    cart: Product[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {

    }

    ngOnInit() {
        this.cart = this.cartService.cart;
    }

    subTotalPrice(): number {
        return this.cart.map(product => product.price).reduce((a, b) => a + b, 0);
    }

    shippingCost(): number {
        return this.subTotalPrice() * 0.5;
    }

    taxes(): number {
        return this.subTotalPrice() * 0.25;
    }

    totalPrice(): number {
        return this.shippingCost() + this.taxes() + this.subTotalPrice();
    }
}
