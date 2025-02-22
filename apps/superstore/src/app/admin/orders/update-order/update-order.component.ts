import { Component, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../order/order.service';
import { AddressDto, OrderDto, OrderState, UserDto } from '@superstore/interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'superstore-create-order',
    templateUrl: './update-order.component.html',
    styleUrls: ['./update-order.component.scss'],
})
export class UpdateOrderComponent implements OnInit {

    @Input() editOrder: OrderDto;
    orderStates = [
        OrderState.PENDING,
        OrderState.SHIPPED,
        OrderState.DELIVERED,
        OrderState.CANCELED,
    ];

    formUpdateOrder = new FormGroup({
        id: new FormControl(),
        name: new FormControl({ disabled: true, value: '' }, [Validators.required]),
        address: new FormControl({ disabled: true, value: '' }, [Validators.required]),
        state: new FormControl('', [Validators.required]),
        deliveryMethod: new FormControl({ disabled: true, value: '' }, [Validators.required]),
        price: new FormControl({ disabled: true, value: 0 }, [Validators.required]),
    });

    @Output() updatedOrder$: Subject<OrderDto> = new Subject<OrderDto>;
    unsubscribe$ = new Subject<void>();

    constructor(
        private readonly orderService: OrderService,
    ) {
    }

    ngOnInit() {
        if (this.editOrder?.id) {
            const user: UserDto = this.editOrder.user;
            const address: AddressDto = this.editOrder.address;

            this.formUpdateOrder.setValue({
                name: `${ user.firstName } ${ user.lastName }`,
                id: this.editOrder.id,
                address: `${ address.address }, ${ address.city }, ${ address.zipCode }, ${ address.country }`,
                state: this.editOrder.state,
                deliveryMethod: this.editOrder.deliveryMethod,
                price: this.editOrder.totalPrice
            });
        }
    }

    updateOrder() {
        const { id: orderId, state } = this.formUpdateOrder.value;

        if (Object.values(OrderState).includes(state as OrderState)) {
            const s = state as OrderState;
            this.orderService.updateOrderState(orderId, s)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (order) => {
                        this.formUpdateOrder.reset();
                        this.updatedOrder$.next(order);
                    }
                });
        }
    }

    closeModalAddProduct() {
        this.updatedOrder$.next(null);
    }

    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModalAddProduct();
    }
}
