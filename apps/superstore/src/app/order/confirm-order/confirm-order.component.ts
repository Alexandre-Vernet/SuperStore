import { Component, OnInit } from '@angular/core';
import { UserService } from "../../user/user.service";
import { AddressDto, OrderDto, ProductDto } from "@superstore/libs";
import { OrderService } from "../order.service";
import { ProductService } from "../../product/product.service";
import { ProductPipe } from "../../product/product.pipe";
import { Cart } from "../../cart/cart";

@Component({
    selector: 'superstore-confirm-order',
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss'],
})
export class ConfirmOrderComponent implements OnInit {

    confirmOrder: {
        order: OrderDto,
        address: AddressDto,
        products: ProductDto[],
    };

    constructor(
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.orderService.getLastOrder()
            .subscribe((order: OrderDto) => {
                this.orderService.getOrder(order.id)
                    .subscribe((order: OrderDto) => {

                        this.productService.getProductFromIds(order.productsId)
                            .subscribe((products) => {

                                this.userService.getAddress(order.addressId)
                                    .subscribe((address: AddressDto) => {
                                        this.confirmOrder = {
                                            order,
                                            address,
                                            products,
                                        }
                                    });
                            });
                    });
            });
    }

    convertProductNameToSlug(name: string): string {
        return new ProductPipe().convertProductNameToSlug(name);
    }

    subTotalPrice(): number {
        let total = 0;
        this.confirmOrder?.products
            .map(item => {
                total += item.price;
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
}
