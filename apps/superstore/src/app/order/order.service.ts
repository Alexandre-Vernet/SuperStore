import { Injectable } from '@angular/core';
import { CreateOrderDto, OrderDto, OrderWithAddressAndUserDto, OrderWithProductsDto } from "@superstore/libs";
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

    getOrders(): Observable<OrderWithAddressAndUserDto[]> {
        return this.http.get<OrderWithAddressAndUserDto[]>(`${ this.orderUri }`);
    }

    getOrdersPerUser(): Observable<OrderWithProductsDto[]> {
        const userId = this.authService.user.id;
        return this.http.get<OrderWithProductsDto[]>(`${ this.orderUri }/user/${ userId }`)
            .pipe(
                tap((orders) => {
                        orders.map(order => order.createdAt = new Date(order.createdAt));
                    }
                )
            );
    }

    getOrder(orderId: number): Observable<OrderDto> {
        return this.http.get<OrderDto>(`${ this.orderUri }/${ orderId }`);
    }

    getLastOrder(): Observable<OrderDto> {
        const userId = this.authService.user.id;
        return this.http.get<OrderDto>(`${ this.orderUri }/${ userId }/last`);
    }

    updateOrderState(orderId: number, state: string): Observable<OrderDto> {
        return this.http.put<OrderDto>(`${ this.orderUri }/${ orderId }`, { state });
    }

    deleteOrder(orderId: number): Observable<void> {
        return this.http.delete<void>(`${ this.orderUri }/${ orderId }`);
    }
}
