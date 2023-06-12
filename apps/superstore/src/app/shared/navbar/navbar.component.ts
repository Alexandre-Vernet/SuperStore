import { Component } from '@angular/core';
import { CartService } from "../../cart/cart.service";
import { AppComponent } from "../../app.component";
import { CartDto, UserDto } from "@superstore/libs";

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {

    user: UserDto;
    cart: CartDto[] = [];

    constructor(
        private readonly cartService: CartService,
    ) {
    }

    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }


    getTotalItemsInCart(): number {
        return this.cartService.cart.length;
    }
}
