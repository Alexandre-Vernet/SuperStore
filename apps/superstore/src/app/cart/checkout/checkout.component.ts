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
import { PromotionService } from '../../promotion/promotion.service';
import { catchError, distinctUntilChanged, filter, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

    cart: ProductDto[] = [];
    deliveryMethods = deliveryMethods;
    selectedDeliveryMethod: DeliveryMethod;
    shippingPrice = this.deliveryMethods[0].price;

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
            filter(response => response !== null),
            switchMap((promotion) => {
                    return this.promotionService.usePromotionCode(promotion)
                        .pipe(
                            catchError((err) => {
                                this.formPromotion.setErrors({ error: err.error.message });
                                this.promotion = null;
                                return of(null);
                            })
                        );
                }
            )
        ).subscribe((promotion: PromotionDto) => this.promotion = promotion);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    selectAddress(address: AddressDto) {
        if (!address) {
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

        this.updateShippingPrice(deliveryMethod.price);
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
            address: newAddress,
            orderProducts,
            promotion: this.promotion,
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
        this.orderService
            .confirmOrder(order)
            .subscribe(() => this.router.navigateByUrl('/order/confirm-order'));
    }
}
