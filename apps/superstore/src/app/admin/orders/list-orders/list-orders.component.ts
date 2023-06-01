import { Component, HostListener, OnInit } from '@angular/core';
import { OrderDto, OrderWithAddressAndUserDto } from "@superstore/libs";
import { AdminService } from "../../admin.service";
import { OrderService } from "../../../order/order.service";
import { UserService } from "../../../user/user.service";
import { ProductService } from "../../../product/product.service";

@Component({
    selector: 'superstore-orders',
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.scss'],
})
export class ListOrdersComponent implements OnInit {

    orders: OrderWithAddressAndUserDto[];
    editedOrder: OrderWithAddressAndUserDto;
    searchBar = '';

    constructor(
        private readonly orderService: OrderService,
        private readonly userService: UserService,
        private readonly productService: ProductService,
        public adminService: AdminService
    ) {
    }

    ngOnInit() {
        this.orderService.orders
            .subscribe((orders) => {
                orders.map(order => {
                    this.userService.getAddress(order.addressId)
                        .subscribe((address) => {
                            const shortAddress = `${ address.address } ${ address.city } ${ address.postalCode }`;
                            order.address = shortAddress;
                        });

                    this.userService.getUser(order.userId)
                        .subscribe((user) => {
                            const shortUser = `${ user.firstName } ${ user.lastName }`;
                            order.user = shortUser;
                        });

                    this.productService.getProductFromIds(order.productsId)
                        .subscribe((products) => {
                            order.products = products;
                        });
                });
                this.orders = orders;
            });
    }

    editOrder(order: OrderWithAddressAndUserDto) {
        this.editedOrder = order;
        this.adminService.openModal();
    }

    deleteOrder(order: OrderDto) {
        this.orderService.deleteOrder(order.id).subscribe();
    }

    // Escape key to clear search bar
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (this.searchBar.length > 0) {
            this.searchBar = '';
        }
    }
}
