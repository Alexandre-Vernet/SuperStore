import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from "../../cart/cart.service";
import { AppComponent } from "../../app.component";
import { CartDto, ProductDto, UserDto } from "@superstore/libs";
import { ProductService } from "../../product/product.service";
import { ProductPipe } from "../../product/product.pipe";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

    cart: CartDto[] = [];
    searchBar = '';
    searchResults: ProductDto[] = [];
    user: UserDto;

    constructor(
        private readonly cartService: CartService,
        private readonly productService: ProductService,
        private readonly authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.productService.getProducts(300, 1)
            .subscribe(result => {
                this.searchResults = result.products;
            });
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

    signOut(): void {
        this.authService.signOut();
        this.router.navigate(['/']);
    }

    getTotalItemsInCart(): number {
        return this.cartService.cart.length;
    }

    // Keyboard shortcut CTRL + / to focus on searchBar input
    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    @HostListener('window:keydown.control.:', ['$event'])
    focusSearchInput(event: KeyboardEvent): void {
        event.preventDefault();
        document.getElementById('searchBar').focus();
    }

    // Keyboard shortcut ESC to close searchBar results
    @HostListener('window:keydown.escape', ['$event'])
    closeSearchResults(): void {
        this.searchBar = '';
    }

    searchProducts($event: Event): void {
        this.searchBar = ($event.target as HTMLInputElement).value;
    }

    viewProduct(product: ProductDto): void {
        this.router.navigate(['/product', this.convertProductNameToSlug(product.name)])
            .then(() => this.closeSearchResults());
    }
}
