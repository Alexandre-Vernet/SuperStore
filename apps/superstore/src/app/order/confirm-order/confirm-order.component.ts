import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../user/user.service";
import { AddressDto, OrderDto, ProductDto } from "@superstore/libs";
import { OrderService } from "../order.service";
import { ProductService } from "../../product/product.service";
import { ProductPipe } from "../../product/product.pipe";

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
        private activatedRoute: ActivatedRoute,
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: { orderId: string }) => {

            this.orderService.getOrder(params.orderId)
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
}