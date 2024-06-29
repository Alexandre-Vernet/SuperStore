import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../order/order.service';
import { AddressDto, OrderProductDto, OrderState, UserDto } from '@superstore/interfaces';

@Component({
    selector: 'superstore-create-order',
    templateUrl: './create-order.component.html',
    styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {

    @Input() editOrder: OrderProductDto;
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    orderStates = [
        OrderState.PENDING,
        OrderState.CONFIRMED,
        OrderState.SHIPPED,
        OrderState.DELIVERED,
        OrderState.CANCELED,
    ];

    formUpdateOrder = new FormGroup({
        id: new FormControl(0, [Validators.required]),
        name: new FormControl({ disabled: true, value: '' }, [Validators.required]),
        address: new FormControl({ disabled: true, value: '' }, [Validators.required]),
        products: new FormControl([], [Validators.required]),
        state: new FormControl('', [Validators.required]),
        deliveryMethod: new FormControl({ disabled: true, value: '' }, [Validators.required]),
        paymentMethod: new FormControl({ disabled: true, value: '' }, [Validators.required]),
        price: new FormControl({ disabled: true, value: 0 }, [Validators.required]),
    });


    constructor(
        private readonly orderService: OrderService,
    ) {
    }

    ngOnInit() {
        if (this.editOrder?.id) {
            const user: UserDto = this.editOrder.user;
            const address: AddressDto = this.editOrder.address;
            const products = this.editOrder.products;

            this.formUpdateOrder.setValue({
                name: `${ user.firstName } ${ user.lastName }`,

                id: this.editOrder.id,
                address: `${ address.address }, ${ address.city }, ${ address.zipCode }, ${ address.country }`,
                products,
                state: this.editOrder.state,
                deliveryMethod: this.editOrder.deliveryMethod,
                paymentMethod: this.editOrder.paymentMethod,
                price: this.editOrder.totalPrice
            });
        }
    }

    updateOrder() {
        const { id: orderId, state } = this.formUpdateOrder.value;

        this.orderService.updateOrderState(orderId, state)
            .subscribe(() => {
                this.formUpdateOrder.reset();
                this.closeModalAddProduct();
            });
    }

    closeModalAddProduct() {
        this.closeModal.emit();
    }

    // Escape key to close modal
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.closeModalAddProduct();
    }
}
