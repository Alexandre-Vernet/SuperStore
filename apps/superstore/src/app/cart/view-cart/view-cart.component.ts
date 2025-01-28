import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { deliveryMethods, ProductDto } from '@superstore/interfaces';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-view-cart',
    templateUrl: './view-cart.component.html',
    styleUrls: ['./view-cart.component.scss'],
})
export class ViewCartComponent implements OnInit, OnDestroy {

    cart: ProductDto[] = [];

    price = {
        taxesPrice: 0,
        shippingPrice: 0,
        subTotalPrice: 0,
        totalPrice: 0
    };

    updateQuantity$ = new BehaviorSubject<void>(null);
    unsubscribe$ = new Subject<void>;

    constructor(
        private readonly cartService: CartService,
    ) {
    }

    ngOnInit() {
        this.cart = this.cartService.cart;

        this.updateQuantity$.pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => this.price = this.cartService.setPrice(null, deliveryMethods[0]));
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    getPricePerItem(item: ProductDto): number {
        return item.price * item.quantity;
    }

    removeFromCart(product: ProductDto) {
        this.cart = this.cartService.removeFromCart(product);
        this.updateQuantity$.next();
    }

    updateQuantity(item: ProductDto, event: Event) {
        const quantityUpdated = Number((event.target as HTMLInputElement).value);
        this.cartService.updateQuantity(item, quantityUpdated);
        this.updateQuantity$.next();
    }
}
