import { Injectable } from '@angular/core';
import { OrderDto, OrderState } from '@superstore/interfaces';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ErrorService } from '../error/error.service';
import { PdfService } from '../shared/pdf/pdf.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    orderUri = environment.orderUri();

    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthService,
        private readonly notificationsService: NotificationsService,
        private readonly errorService: ErrorService,
        private readonly pdfService: PdfService
    ) {
    }

    createPaymentIntent(amount: number) {
        return this.http.post<{
            paymentIntent: { client_secret: string }
        }>(`${ this.orderUri }/create-payment-intent`, { amount })
            .pipe(
                map(res => ({
                    paymentIntent: {
                        clientSecret: res.paymentIntent.client_secret
                    }
                }))
            );
    }

    create(order: OrderDto): Observable<boolean> {
        return this.http.post<OrderDto>(this.orderUri, order)
            .pipe(
                switchMap((createdOrder) =>
                    this.pdfService.downloadInvoice(createdOrder, false)
                        .pipe(
                            switchMap((pdfDataUri) => this.sendEmailConfirmationOrder(createdOrder, pdfDataUri))
                        )),
                map(() => true)
            );
    }

    sendEmailConfirmationOrder(order: OrderDto, pdfDataUri: string): Observable<void> {
        const invoiceBase64 = pdfDataUri.split(',')[1];
        return this.http.post<void>(`${ this.orderUri }/invoice`, {
            order,
            invoice: invoiceBase64
        });
    }


    findAll(): Observable<OrderDto[]> {
        return this.http.get<OrderDto[]>(this.orderUri);
    }

    getUserOrders(): Observable<OrderDto[]> {
        return this.authService.user$
            .pipe(
                switchMap(user => {
                    if (user) {
                        return this.http.get<OrderDto[]>(`${ this.orderUri }/user/${ user.id }`)
                            .pipe(
                                catchError((err) => {
                                    this.notificationsService.showErrorNotification('Error', err.error.message);
                                    return of(null);
                                })
                            );
                    } else {
                        return of([]);
                    }
                })
            );
    }

    getLastOrder(): Observable<OrderDto> {
        return this.authService.user$
            .pipe(
                switchMap(user => this.http.get<OrderDto>(`${ this.orderUri }/${ user.id }/last`))
            );
    }

    updateOrderState(orderId: number, state: OrderState): Observable<OrderDto> {
        return this.http.put<OrderDto>(`${ this.orderUri }/${ orderId }`, { state })
            .pipe(
                catchError((err) => {
                    this.notificationsService.showErrorNotification('Error', err.error.message);
                    return of(null);
                })
            );
    }

    deleteOrder(orderId: number): Observable<void> {
        return this.http.delete<void>(`${ this.orderUri }/${ orderId }`)
            .pipe(
                catchError((err) => {
                        this.errorService.setError(err.error.message);
                        return of(null);
                    }
                )
            );
    }

    userCanAddReview(productId: number): Observable<boolean> {
        return this.authService.user$
            .pipe(
                switchMap(user => {
                    if (user) {
                        return this.http.get<boolean>(`${ this.orderUri }/${ productId }/${ user.id }`);
                    } else {
                        return of(false);
                    }
                })
            );
    }
}
