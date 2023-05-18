import { Injectable } from '@angular/core';
import { CreateOrderDto, NotificationsDto } from "@superstore/libs";
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

    confirmOrder(order: CreateOrderDto): Observable<NotificationsDto> {
        return this.http.post<NotificationsDto>(this.orderUri, order)
            .pipe(
                tap(() => this.cartService.clearCart())
            )
    }
}
