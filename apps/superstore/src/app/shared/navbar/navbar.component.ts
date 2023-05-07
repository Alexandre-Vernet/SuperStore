import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from "../../cart/cart.service";
import { AppComponent } from "../../app.component";
import { CartDto, ProductDto } from "@superstore/libs";
import { ProductService } from "../../product/product.service";
import { ProductPipe } from "../../product/product.pipe";
import { Router } from "@angular/router";

@Component({
    selector: 'superstore-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

    cart: CartDto[] = [];
    searchBar = '';
    searchResults: ProductDto[] = [];

    constructor(
        private readonly cartService: CartService,
        private readonly productService: ProductService,
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

    getTotalItemsInCart(): number {
        return this.cartService.cart.length;
    }

    // Keyboard shortcut CTRL + / to focus on searchBar input
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

    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    searchProducts($event: Event): void {
        const search = ($event.target as HTMLInputElement).value;
        this.searchBar = search;
    }

    viewProduct(product: ProductDto): void {
        this.router.navigate(['/product', this.convertProductNameToSlug(product.name)])
            .then(() => this.closeSearchResults());
    }
}
