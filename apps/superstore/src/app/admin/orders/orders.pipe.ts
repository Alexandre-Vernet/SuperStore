import { Pipe, PipeTransform } from '@angular/core';
import { OrderWithAddressAndUserDto } from "@superstore/interfaces";

@Pipe({
    name: 'searchOrders'
})
export class OrdersPipe implements PipeTransform {
    transform(search: string, orders: OrderWithAddressAndUserDto[]): OrderWithAddressAndUserDto[] {
        return orders?.filter(order => {
            return order.id.toString().includes(search?.toLowerCase()) ||
                order.address.toLowerCase().includes(search?.toLowerCase()) ||
                order.state.toLowerCase().includes(search?.toLowerCase()) ||
                order.user.toLowerCase().includes(search?.toLowerCase()) ||
                order.totalPrice.toString().toLowerCase().includes(search?.toLowerCase());
        });
    }
}
