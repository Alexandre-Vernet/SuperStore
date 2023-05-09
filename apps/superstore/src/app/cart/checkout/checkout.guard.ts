import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from "../cart.service";

@Injectable({
    providedIn: 'root'
})
export class CheckoutGuard {
    constructor(
        private cartService: CartService,
        private router: Router,
    ) {
    }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const cartLocalStorage = JSON.parse(localStorage.getItem('cart'));
        return new Promise((resolve, reject) => {
            if (cartLocalStorage && cartLocalStorage.length > 0) {
                resolve(true);
            } else {
                reject(false);
                this.router.navigate(['/cart']);
            }
        });
    }
}
