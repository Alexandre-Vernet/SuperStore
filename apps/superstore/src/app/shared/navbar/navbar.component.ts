import { Component } from '@angular/core';
import { CartService } from "../../cart/cart.service";
import { AppComponent } from "../../app.component";
import { CartDto, UserDto } from "@superstore/libs";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";

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
        private readonly authService: AuthService,
        private readonly router: Router
    ) {
    }

    toggleResponsiveMenu(): void {
        AppComponent.displayResponsiveMenu = !AppComponent.displayResponsiveMenu;
    }

    getUserConnected(): UserDto {
        return this.authService.user;
    }

    getFirstNameAndLastName(): string {
        return `${ this.getUserConnected().firstName } ${ this.getUserConnected().lastName }`;
    }

    userIsAdmin(): boolean {
        return this.authService.user.isAdmin;
    }

    redirectTo(path: string): void {
        this.router.navigateByUrl(path);
    }

    signOut(): void {
        this.authService.signOut();
        this.router.navigateByUrl('/');
    }

    getTotalItemsInCart(): number {
        return this.cartService.cart.length;
    }
}
