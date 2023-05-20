import { Injectable } from '@angular/core';
import { CreateOrderDto, OrderDto } from "@superstore/libs";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CartService } from "../cart/cart.service";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orderUri = environment.orderUri();

    constructor(
        private http: HttpClient,
        private readonly cartService: CartService,
        private readonly authService: AuthService
    ) {
    }

    confirmOrder(order: CreateOrderDto): Observable<OrderDto> {
        return this.http.post<OrderDto>(this.orderUri, order)
            .pipe(
                tap(() => this.cartService.clearCart())
            )
    }

    getOrders(): Observable<OrderDto[]> {
        const userId = this.authService.user.id;
        return this.http.get<OrderDto[]>(`${ this.orderUri }/user/${ userId }`)
            .pipe(
                tap((orders) => {
                    // Convert date
                    orders.forEach(order => {
                        order.createdAt = new Date(order.createdAt);
                    });
                }
            )
        );
    }

    getOrder(orderId: number): Observable<OrderDto> {
        return this.http.get<OrderDto>(`${ this.orderUri }/${ orderId }`);
    }

    getLastOrder(): Observable<OrderDto> {
        const userId = this.authService.user.id;
        return this.http.post<OrderDto>(`${ this.orderUri }/last`, { userId });
    }
}
