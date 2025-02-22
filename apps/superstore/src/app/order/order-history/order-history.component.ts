import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { OrderDto, OrderState, ProductDto } from '@superstore/interfaces';
import { CartService } from '../../cart/cart.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { PdfService } from '../../shared/pdf/pdf.service';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'superstore-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
    orders: OrderDto[];

    displayOrderOptions = false;

    productToReview: ProductDto;

    pagination = {
        currentPage: new BehaviorSubject<number>(1),
        itemsPerPage: 3,
        totalPage: new BehaviorSubject<number>(0)
    };

    showModalAddReview = false;

    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly orderService: OrderService,
        private readonly cartService: CartService,
        private readonly notificationsService: NotificationsService,
        private readonly pdfService: PdfService
    ) {
    }

    ngOnInit() {
        this.orderService.getUserOrders()
            .pipe(
                takeUntil(this.unsubscribe$),
                tap((orders) => orders.sort((a, b) => a?.id - b?.id)),
                tap((orders) => this.pagination.totalPage.next(Math.ceil(orders.length / this.pagination.itemsPerPage)))
            )
            .subscribe((orders) => this.orders = orders);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    toggleOrderOption() {
        this.displayOrderOptions = !this.displayOrderOptions;
    }

    openModalAddReview(product: ProductDto) {
        this.productToReview = product;
       this.showModalAddReview = true;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const menuElement = document.getElementById('menu');

        if (menuElement && !menuElement.contains(clickedElement)) {
            this.displayOrderOptions = false;
        }
    }

    getOrderStateImageFileName(state: OrderState): string {
        return `assets/order-state/${ state.toLowerCase() }.png`;
    }

    downloadInvoice(order: OrderDto) {
        return this.pdfService.downloadInvoice(order);
    }

    addToCart(product: ProductDto) {
        this.cartService.addToCart(product);
        this.notificationsService.showSuccessNotification('Success', 'Product added to cart');
    }

    pageChange(page: number) {
        this.pagination.currentPage.next(page);
    }
}
