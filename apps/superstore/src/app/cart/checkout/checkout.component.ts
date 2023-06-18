import { Component, OnInit } from '@angular/core';
import {
    AddressDto,
    CartDto,
    CreateOrderDto,
    DeliveryMethod,
    DeliveryMethodExpectedDelivery,
    DeliveryMethodPrice, DeliveryMethodType,
    OrderState
} from "@superstore/interfaces";
import { Cart } from "../cart";
import { CartService } from "../cart.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductPipe } from "../../product/product.pipe";
import { AuthService } from "../../auth/auth.service";
import { UserService } from "../../user/user.service";
import { OrderService } from "../../order/order.service";
import { Router } from "@angular/router";
import { NotificationsService } from "../../shared/notifications/notifications.service";

@Component({
    selector: 'superstore-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

    cart: CartDto[] = [];
    addresses: AddressDto[] = [];
    deliveryMethods: DeliveryMethod[] = [
        {
            name: DeliveryMethodType.STANDARD,
            expectedDelivery: DeliveryMethodExpectedDelivery.STANDARD,
            price: DeliveryMethodPrice.STANDARD,
        },
        {
            name: DeliveryMethodType.EXPRESS,
            expectedDelivery: DeliveryMethodExpectedDelivery.EXPRESS,
            price: DeliveryMethodPrice.EXPRESS,
        },
    ];
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
        paymentMethod: new FormControl('CB', [Validators.required]),
    });

    constructor(
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly notificationsService: NotificationsService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.cart = this.cartService.cart;
        this.selectedDeliveryMethod = this.deliveryMethods[0];
        this.formAddress.patchValue({
            deliveryMethod: this.selectedDeliveryMethod.name,
        });

        // Get addresses of user
        this.userService.getAddresses()
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
                    phone: addresses[0]?.phone,
                });
            });
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
            phone: address.phone,
        });
    }

    changeDeliveryMethod(deliveryMethod: DeliveryMethod) {
        this.selectedDeliveryMethod = deliveryMethod;
        this.formAddress.patchValue({
            deliveryMethod: deliveryMethod.name,
        });

        this.updateShippingPrice(deliveryMethod.price);
    }

    clearFormAddress() {
        this.formAddress.reset();
        this.formAddress.patchValue({
            paymentMethod: 'CB',
            deliveryMethod: this.deliveryMethods[0].name,
        });
        this.selectedAddress = null;
    }

    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    updateQuantity(item: CartDto, event: Event) {
        const quantityUpdated = Number((event.target as HTMLInputElement).value);
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

    updateShippingPrice(price: number) {
        this.shippingPrice = price;
    }

    taxes(): number {
        return Cart.convertTwoDecimals(this.subTotalPrice() * 0.25);
    }

    totalPrice(): number {
        return Cart.convertTwoDecimals(this.shippingPrice + this.taxes() + this.subTotalPrice());
    }

    submitForm() {
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

        const userId = this.authService.user.id;

        const order: CreateOrderDto = {
            userId,
            state: OrderState.PENDING,
            addressId: this.selectedAddress?.id,
            productsId: this.cart.map(item => item.id),
            deliveryMethod: this.selectedDeliveryMethod.name.toUpperCase(),
            paymentMethod,
            subTotalPrice: this.subTotalPrice(),
            shippingPrice: this.shippingPrice,
            taxesPrice: this.taxes(),
            totalPrice: this.totalPrice(),
        };

        if (!this.selectedAddress) {
            this.userService
                .createAddress({
                    userId,
                    company,
                    address,
                    apartment,
                    country,
                    city,
                    zipCode,
                    phone
                })
                .subscribe((address) => {
                    order.addressId = address.id;
                    this.orderService.confirmOrder(order).subscribe();
                });
        } else {
            // If form address is different from addresses, create new address
            if (this.selectedAddress.address !== address ||
                this.selectedAddress.apartment !== apartment ||
                this.selectedAddress.country !== country ||
                this.selectedAddress.city !== city ||
                this.selectedAddress.zipCode !== zipCode ||
                this.selectedAddress.phone !== phone) {
                this.userService
                    .createAddress({
                        userId,
                        company,
                        address,
                        apartment,
                        country,
                        city,
                        zipCode,
                        phone
                    })
                    .subscribe((address) => {
                        order.addressId = address.id;
                        this.confirmOrder(order);
                    });
                return;
            }
            this.confirmOrder(order);
        }
    }

    confirmOrder(order: CreateOrderDto) {
        this.orderService
            .confirmOrder(order)
            .subscribe(() => this.router.navigateByUrl('/order/confirm-order'));
    }
}
