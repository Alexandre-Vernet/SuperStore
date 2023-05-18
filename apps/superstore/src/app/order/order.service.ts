import { Injectable } from '@angular/core';
import { CreateOrderDto, OrderDto } from "@superstore/libs";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { CartService } from "../cart/cart.service";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orderUri = environment.orderUri();

    constructor(
        private http: HttpClient,
        private readonly cartService: CartService
    ) {
    }

    confirmOrder(order: CreateOrderDto): Observable<OrderDto> {
        return this.http.post<OrderDto>(this.orderUri, order)
            .pipe(
                tap(() => this.cartService.clearCart())
            )
    }

    getOrder(orderId: string): Observable<OrderDto> {
        return this.http.get<OrderDto>(`${this.orderUri}/${orderId}`);
    }
}