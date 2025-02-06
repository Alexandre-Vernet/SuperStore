import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderDto } from '@superstore/interfaces';
import { OrderService } from '../../../order/order.service';
import { BehaviorSubject, combineLatest, Subject, takeUntil, tap } from 'rxjs';
import { AdminSearchBarComponent } from '../../search-bar/admin-search-bar/admin-search-bar.component';

@Component({
    selector: 'superstore-orders',
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit, OnDestroy {

    orders: OrderDto[] = [];
    filteredOrders: OrderDto[] = [];

    editedOrder: OrderDto;

    showModalAddProduct = false;

    noResultSearch = false;

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 25,
        totalPage: new BehaviorSubject<number>(0)
    };

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly orderService: OrderService
    ) {
    }

    ngOnInit() {
        combineLatest([
            this.orderService.orders$,
            AdminSearchBarComponent.searchBar
        ])
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(([orders]) => orders.sort((a, b) => a?.id - b?.id)),
                tap(([orders]) => this.pagination.totalPage.next(Math.ceil(orders.length / this.pagination.itemsPerPage)))
            )
            .subscribe(([orders, search]) => {
                this.orders = orders;

                if (!search) {
                    this.filteredOrders = [...this.orders];
                    this.noResultSearch = false;
                } else {
                    this.pagination.totalPage.next(0);

                    this.filteredOrders = orders.filter(order =>
                        order.totalPrice.toString().toLowerCase().includes(search.toLowerCase()) ||
                        order.user.email.toString().toLowerCase().includes(search.toLowerCase()) ||
                        order.user.lastName.toString().toLowerCase().includes(search.toLowerCase()) ||
                        order.user.firstName.toString().toLowerCase().includes(search.toLowerCase()) ||
                        order.products.find(p => p.product.name.toLowerCase().includes(search.toLowerCase())) ||
                        order.products.find(p => p.product.description.toLowerCase().includes(search.toLowerCase()))
                    );

                    this.noResultSearch = this.filteredOrders.length === 0;
                }

                this.pagination.currentPage.next(1);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
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
            subTotalPrice: order.subTotalPrice,
            shippingPrice: order.shippingPrice,
            taxesPrice: order.taxesPrice,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt
        };

        this.openModal();
    }

    deleteOrder(order: OrderDto) {
        this.orderService.deleteOrder(order.id).subscribe();
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
