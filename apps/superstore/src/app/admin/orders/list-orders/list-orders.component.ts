import { Component, OnInit } from '@angular/core';
import { OrderDto, OrderProductDto } from '@superstore/interfaces';
import { OrderService } from "../../../order/order.service";
import { SearchBar } from "../../search-bar/search-bar";

@Component({
    selector: 'superstore-orders',
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.scss'],
})
export class ListOrdersComponent implements OnInit {

    orders: OrderProductDto[];
    editedOrder: OrderProductDto;
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


    editOrder(order: OrderProductDto) {
        this.editedOrder = {
            id: order.id,
            user: order.user,
            state: order.state,
            address: order.address,
            productIds: order.products.map(product => product.id),
            deliveryMethod: order.deliveryMethod,
            paymentMethod: order.paymentMethod,
            subTotalPrice: order.subTotalPrice,
            shippingPrice: order.shippingPrice,
            taxesPrice: order.taxesPrice,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            products: order.products,
        };

        this.openModal();
    }

    deleteOrder(order: OrderDto) {
        this.orderService.deleteOrder(order.id).subscribe();
    }
}
