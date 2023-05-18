import { Component, OnInit } from '@angular/core';
import { AddressDto, CartDto, CreateOrderDto, DeliveryMethod, State } from "@superstore/libs";
import { Cart } from "../cart";
import { CartService } from "../cart.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProductPipe } from "../../product/product.pipe";
import { AuthService } from "../../auth/auth.service";
import { UserService } from "../../user/user.service";
import { OrderService } from "../../order/order.service";

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
            name: 'Standard',
            expectedDelivery: '3-5 business days',
            price: 5,
        },
        {
            name: 'Express',
            expectedDelivery: '1-2 business days',
            price: 16,
        },
    ]
    selectedAddress: AddressDto;
    selectedDeliveryMethod: DeliveryMethod;

    formAddress = new FormGroup({
        company: new FormControl(),
        address: new FormControl('', [Validators.required]),
        apartment: new FormControl(),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        postalCode: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        deliveryMethod: new FormControl('', [Validators.required]),
        paymentMethod: new FormControl('CB', [Validators.required]),
    });

    constructor(
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly orderService: OrderService,
    ) {
        const localStorageCart: CartDto[] = JSON.parse(localStorage.getItem('cart'));
        if (localStorageCart) {
            this.cartService.cart = localStorageCart;
        }
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
                    postalCode: addresses[0]?.postalCode,
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
            postalCode: address.postalCode,
            phone: address.phone,
        });
    }

    changeDeliveryMethod(deliveryMethod: DeliveryMethod) {
        this.selectedDeliveryMethod = deliveryMethod;
        this.formAddress.patchValue({
            deliveryMethod: deliveryMethod.name,
        });
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
            paymentMethod
        } = this.formAddress.value;

        const userId = this.authService.user.id;

        const order: CreateOrderDto = {
            userId,
            state: 'pending' as State,
            addressId: this.selectedAddress?.id,
            deliveryMethod: this.selectedDeliveryMethod.name,
            paymentMethod
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
                    postalCode,
                    phone
                })
                .subscribe((address) => {
                    order.addressId = address.id;
                    this.orderService.confirmOrder(order).subscribe();
                });
        } else {
            this.orderService.confirmOrder(order).subscribe();
        }
    }
}
