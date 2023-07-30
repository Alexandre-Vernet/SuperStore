import { Component, OnInit } from '@angular/core';
import { OrderDto, OrderWithAddressAndUserAndProductsDto, OrderWithAddressAndUserDto } from "@superstore/interfaces";
import { AdminService } from "../../admin.service";
import { OrderService } from "../../../order/order.service";
import { UserService } from "../../../user/user.service";
import { ProductService } from "../../../product/product.service";
import { AddressService } from "../../../address/address.service";

@Component({
    selector: 'superstore-orders',
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.scss'],
})
export class ListOrdersComponent implements OnInit {

    orders: OrderWithAddressAndUserAndProductsDto[];
    editedOrder: OrderWithAddressAndUserDto;
    searchBar: string;
    showModalAddProduct = false;

    constructor(
        private readonly orderService: OrderService,
        private readonly userService: UserService,
        private readonly addressService: AddressService,
        private readonly productService: ProductService,
        private readonly adminService: AdminService
    ) {
    }

    ngOnInit() {
        this.orderService.getOrdersWithAddressAndUserAndProducts()
            .subscribe((orders) => {
                this.orders = orders;
            });

        this.adminService.searchBar
            .subscribe((search) => {
                this.searchBar = search;
            });
    }

    openModal() {
        this.showModalAddProduct = true;
    }

    closeModal() {
        this.showModalAddProduct = false;
    }


    editOrder(order: OrderWithAddressAndUserAndProductsDto) {
        this.editedOrder = {
            id: order.id,
            userId: order.user.id,
            state: order.state,
            addressId: order.addressId,
            productsId: order.productsId,
            deliveryMethod: order.deliveryMethod,
            paymentMethod: order.paymentMethod,
            subTotalPrice: order.subTotalPrice,
            shippingPrice: order.shippingPrice,
            taxesPrice: order.taxesPrice,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            address: order.address.address,
            user: `${ order.user.firstName } ${ order.user.lastName }`,
            products: order.products
        };

        this.openModal();
    }

    deleteOrder(order: OrderDto) {
        this.orderService.deleteOrder(order.id).subscribe();
    }
}
