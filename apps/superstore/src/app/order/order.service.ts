import { Injectable } from '@angular/core';
import { CreateOrderDto, OrderDto, OrderWithAddressAndUserDto } from "@superstore/interfaces";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CartService } from "../cart/cart.service";
import { AuthService } from "../auth/auth.service";
import { NotificationsService } from "../shared/notifications/notifications.service";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orderUri = environment.orderUri();
    orders = new BehaviorSubject(<OrderWithAddressAndUserDto[]>[])

    constructor(
        private http: HttpClient,
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly notificationsService: NotificationsService,
    ) {
        this.getOrders().subscribe();
    }

    confirmOrder(order: CreateOrderDto): Observable<OrderDto> {
        return this.http.post<OrderDto>(this.orderUri, order)
            .pipe(
                tap(() => {
                    this.cartService.clearCart();
                    this.notificationsService.showSuccessNotification('Email sent', 'An email has been sent to confirm your order.');
                }),
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    getOrders(): Observable<OrderWithAddressAndUserDto[]> {
        return this.http.get<OrderWithAddressAndUserDto[]>(`${ this.orderUri }`)
            .pipe(
                tap((orders) => {
                    this.orders.next(orders);
                }),
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    getOrdersPerUser(): Observable<OrderDto[]> {
        const userId = this.authService.user.id;
        return this.http.get<OrderDto[]>(`${ this.orderUri }/user/${ userId }`)
            .pipe(
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.message);
                    throw err;
                })
            );
    }

    getOrder(orderId: number): Observable<OrderDto> {
        return this.http.get<OrderDto>(`${ this.orderUri }/${ orderId }`);
    }

    getLastOrder(): Observable<OrderDto> {
        const userId = this.authService.user.id;
        return this.http.get<OrderDto>(`${ this.orderUri }/${ userId }/last`);
    }

    updateOrderState(orderId: number, state: string): Observable<OrderWithAddressAndUserDto> {
        return this.http.put<OrderWithAddressAndUserDto>(`${ this.orderUri }/${ orderId }`, { state })
            .pipe(
                tap((order) => {
                    const orders = this.orders.value.map((p) => {
                        if (p.id === order.id) {
                            return order;
                        } else {
                            return p;
                        }
                    });
                    this.notificationsService.showSuccessNotification('Success', 'Order updated successfully');
                    this.orders.next(orders);
                })
            );
    }

    deleteOrder(orderId: number): Observable<void> {
        return this.http.delete<void>(`${ this.orderUri }/${ orderId }`)
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'Order deleted successfully');
                    const order = this.orders.value.filter((p) => p.id !== orderId);
                    this.orders.next(order);
                }),
                catchError((err) => {
                        this.notificationsService.showErrorNotification('Error', err.message);
                        throw err;
                    }
                )
            );
    }
}
