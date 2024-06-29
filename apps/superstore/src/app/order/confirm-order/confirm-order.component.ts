import { Component, OnInit } from '@angular/core';
import { AddressDto, OrderDto, ProductDto } from "@superstore/interfaces";
import { OrderService } from "../order.service";
import { ProductService } from "../../product/product.service";
import { AddressService } from "../../address/address.service";

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
        private readonly addressService: AddressService,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
    ) {
    }

    ngOnInit() {
        // this.orderService.getLastOrder()
        //     .subscribe((order: OrderDto) => {
        //         this.orderService.getOrder(order.id)
        //             .subscribe((order: OrderDto) => {
        //
        //                 this.productService.getProductFromIds(order.productsId)
        //                     .subscribe((products) => {
        //
        //                         this.addressService.getAddress(order.address.id)
        //                             .subscribe((address: AddressDto) => {
        //                                 this.confirmOrder = {
        //                                     order,
        //                                     address,
        //                                     products,
        //                                 }
        //                             });
        //                     });
        //             });
        //     });
    }
}
