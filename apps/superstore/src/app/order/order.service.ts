import { Injectable } from '@angular/core';
import { OrderDto, OrderProductDto } from '@superstore/interfaces';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart/cart.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../shared/notifications/notifications.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orderUri = environment.orderUri();
    orders: OrderProductDto[] = [];

    constructor(
        private http: HttpClient,
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly notificationsService: NotificationsService
    ) {
    }

    create(order: OrderDto): Observable<OrderDto> {
        return this.http.post<OrderDto>(this.orderUri, order)
            .pipe(
                tap(() => {
                    this.cartService.clearCart();
                    this.notificationsService.showSuccessNotification('Email sent', 'An email has been sent to confirm your order.');
                }),
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.error.message);
                    return of(null);
                })
            );
    }

    getUserOrders(): Observable<OrderDto[]> {
        if (this.authService.user) {
            const userId = this.authService.user.id;
            return this.http.get<OrderDto[]>(`${ this.orderUri }/user/${ userId }`)
                .pipe(
                    catchError((err) => {
                        this.notificationsService.showErrorNotification('Error', err.error.message);
                        return of(null);
                    })
                );
        } else {
            return of([]);
        }
    }

    getOrder(orderId: number): Observable<OrderDto> {
        return this.http.get<OrderDto>(`${ this.orderUri }/${ orderId }`);
    }

    getLastOrder(): Observable<OrderDto> {
        const userId = this.authService.user.id;
        return this.http.get<OrderDto>(`${ this.orderUri }/${ userId }/last`);
    }

    updateOrderState(orderId: number, state: string): Observable<OrderProductDto> {
        return this.http.put<OrderProductDto>(`${ this.orderUri }/${ orderId }`, { state })
            .pipe(
                tap((order) => {
                    const orders = this.orders.map((p) => {
                        if (p.id === order.id) {
                            return order;
                        } else {
                            return p;
                        }
                    });
                    this.notificationsService.showSuccessNotification('Success', 'Order updated successfully');
                    this.orders = orders;
                })
            );
    }

    deleteOrder(orderId: number): Observable<void> {
        return this.http.delete<void>(`${ this.orderUri }/${ orderId }`)
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'Order deleted successfully');
                    this.orders = this.orders.filter((p) => p.id !== orderId);
                }),
                catchError((err) => {
                        this.notificationsService.showErrorNotification('Error', err.error.message);
                        return of(null);
                    }
                )
            );
    }
}
