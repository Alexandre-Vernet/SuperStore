import { Component, OnInit } from '@angular/core';
import { OrderDto } from "@superstore/interfaces";
import { OrderService } from "../order.service";
import { Router } from '@angular/router';

@Component({
    selector: 'superstore-confirm-order',
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss'],
})
export class ConfirmOrderComponent implements OnInit {

    order: OrderDto;

    constructor(
        private readonly orderService: OrderService,
        private readonly router: Router
    ) {
    }

    ngOnInit() {
        this.orderService.getLastOrder()
            .subscribe((order: OrderDto) => {
                if (!order) {
                    this.router.navigate(['/']);
                }
                this.order = order;
            });
    }
}
