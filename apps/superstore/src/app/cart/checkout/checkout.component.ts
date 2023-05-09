import { Component, OnInit } from '@angular/core';
import { CartDto, CreateOrderDto, NotificationsDto, State } from "@superstore/libs";
import { Cart } from "../cart";
import { CartService } from "../cart.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductPipe } from "../../product/product.pipe";

@Component({
    selector: 'superstore-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

    cart: CartDto[] = [];
    form = new FormGroup({
        // email: new FormControl('test@gmail.com', [Validators.required, Validators.email]),
        // firstName: new FormControl('test', [Validators.required]),
        // lastName: new FormControl('test', [Validators.required]),
        company: new FormControl(),
        address: new FormControl('test', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('test', [Validators.required]),
        city: new FormControl('test', [Validators.required]),
        postalCode: new FormControl('test', [Validators.required]),
        phone: new FormControl('test', [Validators.required]),
        deliveryMethod: new FormControl('test', [Validators.required]),
        paymentMethod: new FormControl('CB', [Validators.required]),
    });

    checkoutMessage: NotificationsDto = {
        title: '',
        description: '',
        orderCompleted: false
    }

    constructor(
        private readonly cartService: CartService,
    ) {
        const localStorageCart: CartDto[] = JSON.parse(localStorage.getItem('cart'));
        if (localStorageCart) {
            this.cartService.cart = localStorageCart;
        }
    }

    ngOnInit() {
        this.cart = this.cartService.cart;
    }

    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    updateQuantity(item: CartDto, event) {
        const quantityUpdated: number = event.target.value;
        this.cartService.updateQuantity(item, quantityUpdated);
    }

    removeFromCart(product: CartDto) {
        this.cart = this.cartService.removeFromCart(product);
    }

    subTotalPrice(): number {
        let total = 0;
        this.cart.map(item => {
            total += item.price * item.quantity;
        });
        return Cart.convertTwoDecimals(total);
    }

    shippingPrice(): number {
        if (this.subTotalPrice()) {
            return Cart.convertTwoDecimals(20);
        } else {
            return Cart.convertTwoDecimals(0);
        }
    }

    taxes(): number {
        return Cart.convertTwoDecimals(this.subTotalPrice() * 0.25);
    }

    totalPrice(): number {
        return Cart.convertTwoDecimals(this.shippingPrice() + this.taxes() + this.subTotalPrice());
    }

    confirmOrder() {
        const {
            company,
            address,
            apartment,
            country,
            city,
            postalCode,
            phone,
            deliveryMethod,
            paymentMethod
        } = this.form.value;

        const order: CreateOrderDto = {
            state: 'pending' as State,
            company,
            address,
            apartment,
            country,
            city,
            postalCode,
            phone,
            deliveryMethod,
            paymentMethod
        }
        return this.cartService.confirmOrder(order)
            .subscribe({
                next: (res) => {
                    this.cartService.clearCart();
                    this.toggleNotification(res);
                },
                error :(error) => {
                    this.toggleNotification(error.error);
                }
            });
    }

    toggleNotification(message: NotificationsDto): NotificationsDto {
        this.checkoutMessage = message;
        return message;
    }
}
