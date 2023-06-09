import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AdminService } from "../../admin.service";
import { OrderService } from "../../../order/order.service";
import { OrderState, OrderWithAddressAndUserDto } from "@superstore/interfaces";

@Component({
    selector: 'superstore-edit-order',
    templateUrl: './edit-order.component.html',
    styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {

    @Input() editOrder : OrderWithAddressAndUserDto;
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
        private readonly adminService: AdminService,
        private readonly orderService: OrderService,
    ) {
    }

    ngOnInit() {
        if (this.editOrder?.id) {
            this.formUpdateOrder.setValue({
                id: this.editOrder.id,
                name: this.editOrder.user,
                address: this.editOrder.address,
                products: this.editOrder.products,
                state: this.editOrder.state,
                deliveryMethod: this.editOrder.deliveryMethod,
                paymentMethod: this.editOrder.paymentMethod,
                price: this.editOrder.totalPrice,
            });
        }
    }

    updateOrder() {
        const { id: orderId, state } = this.formUpdateOrder.value;

        this.orderService.updateOrderState(orderId, state)
            .subscribe(() => this.formUpdateOrder.reset());
        this.closeModal();
    }

    closeModal() {
        this.adminService.closeModal();
    }
}
