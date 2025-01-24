import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddressDto, DeliveryMethod, OrderDto, OrderState, ProductDto, PromotionDto } from '@superstore/interfaces';
import { CartService } from '../cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { OrderService } from '../../order/order.service';
import { Router } from '@angular/router';
import { PromotionService } from '../../promotion/promotion.service';
import { catchError, distinctUntilChanged, filter, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'superstore-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

    cart: ProductDto[] = [];
    deliveryMethods: DeliveryMethod[] = [
        {
            name: 'STANDARD',
            expectedDelivery: '3-5 days',
            price: 5
        },
        {
            name: 'EXPRESS',
            expectedDelivery: '1-2 days',
            price: 16
        }
    ];
    selectedDeliveryMethod: DeliveryMethod = this.deliveryMethods[0];

    formAddress = new FormGroup({
        company: new FormControl(),
        address: new FormControl('', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        deliveryMethod: new FormControl(this.selectedDeliveryMethod.name, [Validators.required]),
        paymentMethod: new FormControl('CB', [Validators.required])
    });

    formPromotion = new FormGroup({
        promotionCode: new FormControl('', [Validators.required])
    });
    promotion: PromotionDto;

    stripe: Stripe;
    stripeElement: StripeElements;
    stripeError = new FormControl('');

    promotionCode$ = new Subject<string>();
    buttonCheckout$ = new Subject<void>;
    unsubscribe$ = new Subject<void>;


    constructor(
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly orderService: OrderService,
        private readonly promotionService: PromotionService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.cart = this.cartService.cart;
        const cartAmount = this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

        this.orderService.createPaymentIntent(cartAmount)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(async ({ paymentIntent }) => {
                this.stripe = await loadStripe(environment.STRIPE_PUBLIC_KEY, {});
                this.stripeElement = this.stripe.elements({ clientSecret: paymentIntent.clientSecret });
                const paymentElement = this.stripeElement.create('payment', { layout: 'tabs' });
                paymentElement.mount('#payment-element');
            });

        this.promotionCode$.pipe(
            takeUntil(this.unsubscribe$),
            distinctUntilChanged(),
            switchMap((code) =>
                this.promotionService.checkPromotionCode(code)
                    .pipe(
                        catchError((err) => {
                            this.formPromotion.setErrors({ error: err.error.message });
                            this.promotion = null;
                            return of(null);
                        })
                    )
            ),
            filter(response => response !== null),
            switchMap((promotion) =>
                this.promotionService.usePromotionCode(promotion)
                    .pipe(
                        catchError((err) => {
                            this.formPromotion.setErrors({ error: err.error.message });
                            this.promotion = null;
                            return of(null);
                        }),
                        filter(res => !!res)
                    )
            )
        ).subscribe(promotion => this.promotion = promotion);


        this.buttonCheckout$.pipe(
            takeUntil(this.unsubscribe$),
            switchMap(() => this.stripe.confirmPayment({
                elements: this.stripeElement,
                redirect: 'if_required'
            })),
            map(({ error }) => {
                if (error && (error.type === 'card_error' || error.type === 'validation_error')) {
                    this.stripeError.setErrors({ error: error.message });
                    return false;
                } else if (error) {
                    this.stripeError.setErrors({ error: 'An unexpected error occurred.' });
                    return false;
                }
                return true;
            }),
            filter(formSuccess => formSuccess),
            map(() => {
                // Cast price to number
                this.cart.map(c => c.price = Number(c.price));

                const {
                    company,
                    address,
                    apartment,
                    country,
                    city,
                    zipCode,
                    phone,
                    paymentMethod
                } = this.formAddress.value;

                const newAddress: AddressDto = {
                    user: this.authService.user,
                    company,
                    address,
                    apartment,
                    country,
                    city,
                    zipCode,
                    phone
                };

                const order: OrderDto = {
                    user: this.authService.user,
                    address: newAddress,
                    products: this.cart.map(product => ({
                        product,
                        size: product.size,
                        quantity: product.quantity
                    })),
                    promotion: this.promotion,
                    state: OrderState.PENDING,
                    deliveryMethod: this.selectedDeliveryMethod.name.toUpperCase(),
                    paymentMethod,
                    subTotalPrice: this.subTotalPrice(),
                    shippingPrice: this.shippingPrice(),
                    taxesPrice: this.taxes(),
                    totalPrice: this.totalPrice(),
                    createdAt: new Date()
                };

                return order;
            }),
            switchMap((order) => this.orderService.create(order)),
            filter(formSuccess => formSuccess),
            tap(() => this.router.navigateByUrl('/order/confirm-order')),
            catchError((err) => {
                this.stripeError.setErrors({ error: err.error.message ?? 'An unexpected error occurred.' });
                return of(false);
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    selectAddress(address: AddressDto) {
        if (!address) {
            this.formAddress.reset();
            this.formAddress.patchValue({
                deliveryMethod: this.deliveryMethods[0].name,
                paymentMethod: 'CB'
            });
            return;
        }
        this.formAddress.patchValue({
            company: address?.company,
            address: address.address,
            apartment: address?.apartment,
            country: address.country,
            city: address.city,
            zipCode: address.zipCode,
            phone: address.phone
        });
    }

    changeDeliveryMethod(deliveryMethod: DeliveryMethod) {
        this.selectedDeliveryMethod = deliveryMethod;
        this.formAddress.patchValue({
            deliveryMethod: deliveryMethod.name
        });
    }

    updateQuantity(item: ProductDto, event: Event) {
        const quantityUpdated = Number((event.target as HTMLInputElement).value);
        this.cartService.updateQuantity(item, quantityUpdated);
    }

    removeFromCart(product: ProductDto) {
        this.cart = this.cartService.removeFromCart(product);
    }

    subTotalPrice(): number {
        return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    shippingPrice() {
        if (this.subTotalPrice() >= 100) {
            return 0;
        }
        return this.selectedDeliveryMethod.price;
    }

    taxes(): number {
        return this.subTotalPrice() * 0.25;
    }

    totalPrice(): number {
        if (this.promotion) {
            return this.shippingPrice() + this.taxes() + this.subTotalPrice() - this.promotion.amount;
        }
        return this.shippingPrice() + this.taxes() + this.subTotalPrice();
    }

    applyPromotionCode() {
        const promotionCode = this.formPromotion.value.promotionCode.toString().trim();
        this.promotionCode$.next(promotionCode);
    }

    submitForm() {
        this.buttonCheckout$.next();
    }
}
