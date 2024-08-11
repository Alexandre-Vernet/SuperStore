import { Component, OnInit } from '@angular/core';
import { OrderDto } from '@superstore/interfaces';
import { OrderService } from '../../../order/order.service';
import { SearchBar } from '../../search-bar/search-bar';

@Component({
    selector: 'superstore-orders',
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.scss'],
})
export class ListOrdersComponent implements OnInit {

    orders: OrderDto[];
    editedOrder: OrderDto;
    searchBar: string;
    showModalAddProduct = false;

    constructor(
        private readonly orderService: OrderService
    ) {
    }

    ngOnInit() {
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


    editOrder(order: OrderDto) {
        this.editedOrder = {
            id: order.id,
            user: order.user,
            products: order.products,
            state: order.state,
            address: order.address,
            deliveryMethod: order.deliveryMethod,
            paymentMethod: order.paymentMethod,
            subTotalPrice: order.subTotalPrice,
            shippingPrice: order.shippingPrice,
            taxesPrice: order.taxesPrice,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
        };

        this.openModal();
    }

    deleteOrder(order: OrderDto) {
        this.orderService.deleteOrder(order.id).subscribe();
    }
}
