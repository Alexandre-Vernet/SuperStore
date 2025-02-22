import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AddressDto,
    DeliveryMethod,
    deliveryMethods,
    OrderDto,
    OrderState,
    ProductDto,
    PromotionDto,
    UserDto
} from '@superstore/interfaces';
import { CartService } from '../cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { OrderService } from '../../order/order.service';
import { Router } from '@angular/router';
import { PromotionService } from '../../promotion/promotion.service';
import {
    BehaviorSubject,
    catchError,
    distinctUntilChanged,
    filter,
    map,
    of,
    Subject,
    switchMap,
    takeUntil,
    tap
} from 'rxjs';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'superstore-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

    user: UserDto;
    cart: ProductDto[] = [];

    deliveryMethods: DeliveryMethod[] = deliveryMethods;
    selectedDeliveryMethod: DeliveryMethod = this.deliveryMethods[0];

    formAddress = new FormGroup({
        company: new FormControl(),
        address: new FormControl('', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        deliveryMethod: new FormControl(this.selectedDeliveryMethod.name, [Validators.required])
    });

    formPromotion = new FormGroup({
        promotionCode: new FormControl('', [Validators.required])
    });
    promotion: PromotionDto;

    stripe: Stripe;
    stripeElement: StripeElements;
    stripeError = new FormControl('');
    isLoading = false;

    price = {
        taxesPrice: 0,
        shippingPrice: 0,
        subTotalPrice: 0,
        totalPrice: 0
    };

    promotionCode$ = new Subject<string>();
    buttonCheckout$ = new Subject<void>;
    updateQuantity$ = new BehaviorSubject<void>(null);
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

        this.authService.user$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(user => this.user = user);

        this.updateQuantity$.pipe(
            takeUntil(this.unsubscribe$),
            map(() => this.price = this.cartService.setPrice(this.promotion, this.selectedDeliveryMethod)),
            switchMap(() => this.orderService.createPaymentIntent(this.price.totalPrice)),
            catchError(() => {
                this.stripeError.setErrors({ error: 'An error has occurred in loading payment module' });
                return of(null);
            }),
            filter(res => !!res?.paymentIntent?.clientSecret)
        )
            .subscribe(async ({ paymentIntent }) => {
                this.stripe = await loadStripe(environment.STRIPE_PUBLIC_KEY, {});
                this.stripeElement = this.stripe.elements({ clientSecret: paymentIntent.clientSecret });
                const paymentElement = this.stripeElement.create('payment', { layout: 'tabs' });
                paymentElement.mount('#payment-element');
            });

        this.promotionCode$.pipe(
            takeUntil(this.unsubscribe$),
            distinctUntilChanged(),
            switchMap((code) => this.promotionService.checkPromotionCode(code)),
            filter(response => response !== null),
            switchMap((promotion) => this.promotionService.usePromotionCode(promotion)),
            catchError((err) => {
                this.formPromotion.setErrors({ error: err.error.message });
                this.promotion = null;
                return of(null);
            })
        ).subscribe(promotion => this.promotion = promotion);


        this.buttonCheckout$.pipe(
            takeUntil(this.unsubscribe$),
            tap(() => this.isLoading = true),
            switchMap(() => this.stripe.confirmPayment({
                elements: this.stripeElement,
                redirect: 'if_required'
            })),
            map(({ error }) => {
                if (error) {
                    const isKnownError = ['card_error', 'validation_error'].includes(error.type);
                    if (!isKnownError) {
                        this.stripeError.setErrors({ error: 'An unexpected error occurred.' });
                    }
                    return false;
                }
                return true;
            }),
            filter(formSuccess => {
                if (!formSuccess) {
                    this.isLoading = false;
                }
                return formSuccess;
            }),
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
                    phone
                } = this.formAddress.value;

                const newAddress: AddressDto = {
                    user: this.user,
                    company,
                    address,
                    apartment,
                    country,
                    city,
                    zipCode,
                    phone
                };

                const { taxesPrice, shippingPrice, subTotalPrice, totalPrice } = this.price;

                const order: OrderDto = {
                    user: this.user,
                    address: newAddress,
                    products: this.cart.map(product => ({
                        product,
                        size: product.size,
                        quantity: product.quantity
                    })),
                    promotion: this.promotion,
                    state: OrderState.PENDING,
                    deliveryMethod: this.selectedDeliveryMethod.name.toUpperCase(),
                    subTotalPrice,
                    shippingPrice,
                    taxesPrice,
                    totalPrice,
                    createdAt: new Date()
                };

                return order;
            }),
            switchMap((order) => this.orderService.create(order)),
            filter(createdOrder => {
                if (!createdOrder) {
                    this.isLoading = false;
                }
                return createdOrder;
            }),
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

    getPricePerItem(item: ProductDto): number {
        return item.price * item.quantity;
    }

    selectAddress(address: AddressDto) {
        if (!address) {
            this.formAddress.reset();
            this.formAddress.patchValue({
                deliveryMethod: this.deliveryMethods[0].name
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
        this.updateQuantity$.next();
    }

    updateQuantity(item: ProductDto, event: Event) {
        const quantityUpdated = Number((event.target as HTMLInputElement).value);
        this.cartService.updateQuantity(item, quantityUpdated);
        this.updateQuantity$.next();
    }

    removeFromCart(product: ProductDto) {
        this.cart = this.cartService.removeFromCart(product);
        this.updateQuantity$.next();
    }

    applyPromotionCode() {
        const promotionCode = this.formPromotion.value.promotionCode.toString().trim();
        this.promotionCode$.next(promotionCode);
    }

    submitForm() {
        this.buttonCheckout$.next();
    }
}
