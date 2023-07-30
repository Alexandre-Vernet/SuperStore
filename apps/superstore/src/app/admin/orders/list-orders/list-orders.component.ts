import { Component, OnInit } from '@angular/core';
import { OrderDto, OrderWithAddressAndUserAndProductsDto, OrderWithAddressAndUserDto } from "@superstore/interfaces";
import { OrderService } from "../../../order/order.service";
import { SearchBar } from "../../search-bar/search-bar";

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
        private readonly orderService: OrderService
    ) {
    }

    ngOnInit() {
        this.orderService.getOrdersWithAddressAndUserAndProducts()
            .subscribe((orders) => {
                this.orders = orders;
            });

        SearchBar.searchBar
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
