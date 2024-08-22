import { Injectable } from '@angular/core';
import { OrderDto, OrderState } from '@superstore/interfaces';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart/cart.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ErrorService } from '../error/error.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orderUri = environment.orderUri();
    private ordersSubject = new BehaviorSubject<OrderDto[]>([]);
    orders$ = this.ordersSubject.asObservable();

    constructor(
        private http: HttpClient,
        private readonly cartService: CartService,
        private readonly authService: AuthService,
        private readonly notificationsService: NotificationsService,
        private readonly errorService: ErrorService
    ) {
        if (this.authService.user.isAdmin) {
            this.findAll().subscribe();
        }
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

    findAll(): Observable<OrderDto[]> {
        return this.http.get<OrderDto[]>(this.orderUri)
            .pipe(
                tap((orders) => {
                    this.ordersSubject.next(orders);
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

    updateOrderState(orderId: number, state: OrderState): Observable<OrderDto> {
        return this.http.put<OrderDto>(`${ this.orderUri }/${ orderId }`, { state })
            .pipe(
                tap((updatedOrder) => {
                    const orders = this.ordersSubject.value.map(p =>
                        p.id === updatedOrder.id ? updatedOrder : p
                    );
                    this.ordersSubject.next(orders);
                    this.notificationsService.showSuccessNotification('Success', 'Order updated successfully');
                }),
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.error.message);
                    return of(null);
                })
            );
    }

    deleteOrder(orderId: number): Observable<void> {
        return this.http.delete<void>(`${ this.orderUri }/${ orderId }`)
            .pipe(
                tap(() => {
                    this.notificationsService.showSuccessNotification('Success', 'Order deleted successfully');
                    const orders = this.ordersSubject.getValue().filter((p) => p.id !== orderId);
                    this.ordersSubject.next(orders);
                }),
                catchError((err) => {
                        this.errorService.setError(err.error.message);
                        return of(null);
                    }
                )
            );
    }

    userCanAddReview(productId: number): Observable<boolean> {
        const userId = this.authService.user.id;
        return this.http.get<boolean>(`${ this.orderUri }/${ productId }/${ userId }`);
    }
}
