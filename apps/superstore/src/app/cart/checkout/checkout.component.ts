import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AddressDto,
    DeliveryMethod,
    deliveryMethods,
    OrderDto,
    OrderProductDto,
    OrderState,
    ProductDto,
    PromotionDto
} from '@superstore/interfaces';
import { Cart } from '../cart';
import { CartService } from '../cart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { OrderService } from '../../order/order.service';
import { Router } from '@angular/router';
import { AddressService } from '../../address/address.service';
import { PromotionService } from '../../promotion/promotion.service';
import { catchError, distinctUntilChanged, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

    cart: ProductDto[] = [];
    addresses: AddressDto[] = [];
    deliveryMethods = deliveryMethods;
    shippingPrice = this.deliveryMethods[0].price;
    selectedAddress: AddressDto;
    selectedDeliveryMethod: DeliveryMethod;

    formAddress = new FormGroup({
        company: new FormControl(),
        address: new FormControl('', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        deliveryMethod: new FormControl('', [Validators.required]),
        paymentMethod: new FormControl('CB', [Validators.required])
    });

    formPromotion = new FormGroup({
        promotionCode: new FormControl('', [Validators.required])
    });
    promotion: PromotionDto;

    buttonApplyPromotion$ = new Subject<string>();
    unsubscribe$ = new Subject<void>;

    constructor(
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly addressService: AddressService,
        private readonly orderService: OrderService,
        private readonly promotionService: PromotionService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.cart = this.cartService.cart;
        this.selectedDeliveryMethod = this.deliveryMethods[0];
        this.formAddress.patchValue({
            deliveryMethod: this.selectedDeliveryMethod.name
        });

        // Get addresses of user
        this.addressService.getUserAddresses()
            .subscribe(addresses => {
                this.addresses = addresses;
                this.selectedAddress = addresses[0];

                this.formAddress.patchValue({
                    company: addresses[0]?.company,
                    address: addresses[0]?.address,
                    apartment: addresses[0]?.apartment,
                    country: addresses[0]?.country,
                    city: addresses[0]?.city,
                    zipCode: addresses[0]?.zipCode,
                    phone: addresses[0]?.phone
                });
            });


        this.buttonApplyPromotion$.pipe(
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
            switchMap((promotion) => {
                    if (promotion) {
                        return this.promotionService.usePromotionCode(promotion)
                            .pipe(
                                catchError((err) => {
                                    this.formPromotion.setErrors({ error: err.error.message });
                                    this.promotion = null;
                                    return of(null);
                                })
                            );
                    } else {
                        return of(null);
                    }
                }
            )
        ).subscribe((promotion: PromotionDto) => this.promotion = promotion);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    changeAddress(address: AddressDto) {
        this.selectedAddress = address;
        this.formAddress.patchValue({
            company: address.company,
            address: address.address,
            apartment: address.apartment,
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

        this.updateShippingPrice(deliveryMethod.price);
    }

    clearFormAddress() {
        this.formAddress.reset();
        this.formAddress.patchValue({
            paymentMethod: 'CB',
            deliveryMethod: this.deliveryMethods[0].name
        });
        this.selectedAddress = null;
    }

    updateQuantity(item: ProductDto, event: Event) {
        const quantityUpdated = Number((event.target as HTMLInputElement).value);
        this.cartService.updateQuantity(item, quantityUpdated);
    }

    removeFromCart(product: ProductDto) {
        this.cart = this.cartService.removeFromCart(product);
    }

    subTotalPrice(): number {
        const total = this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        return Cart.convertTwoDecimals(total);
    }

    updateShippingPrice(price: number) {
        this.shippingPrice = price;
    }

    taxes(): number {
        return Cart.convertTwoDecimals(this.subTotalPrice() * 0.25);
    }

    totalPrice(): number {
        if (this.promotion) {
            return Cart.convertTwoDecimals((this.shippingPrice + this.taxes() + this.subTotalPrice() - this.promotion.amount));
        }
        return Cart.convertTwoDecimals(this.shippingPrice + this.taxes() + this.subTotalPrice());
    }

    applyPromotionCode() {
        const promotionCode = this.formPromotion.value.promotionCode.toString().trim();
        this.buttonApplyPromotion$.next(promotionCode);
    }

    submitForm() {
        // Cast price to number
        this.cart.map(c => c.price = Number(c.price));
        const orderProducts: OrderProductDto[] = this.cart.map(product => ({
            products: [product]
        }));

        const user = this.authService.user;

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
            user,
            company,
            address,
            apartment,
            country,
            city,
            zipCode,
            phone
        };

        const order: OrderDto = {
            user,
            address: this.selectedAddress ?? newAddress,
            orderProducts,
            state: OrderState.PENDING,
            deliveryMethod: this.selectedDeliveryMethod.name.toUpperCase(),
            paymentMethod,
            subTotalPrice: this.subTotalPrice(),
            shippingPrice: this.shippingPrice,
            taxesPrice: this.taxes(),
            totalPrice: this.totalPrice(),
            createdAt: new Date()
        };

        this.confirmOrder(order);
    }

    confirmOrder(order: OrderDto) {
        console.log(order);
        this.orderService
            .confirmOrder(order)
            .subscribe(() => this.router.navigateByUrl('/order/confirm-order'));
    }
}
