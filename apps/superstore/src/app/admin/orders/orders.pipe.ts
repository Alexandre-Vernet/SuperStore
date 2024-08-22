import { Pipe, PipeTransform } from '@angular/core';
import { OrderDto } from '@superstore/interfaces';

@Pipe({
    name: 'searchOrders'
})
export class OrdersPipe implements PipeTransform {
    transform(search: string, orders: OrderDto[]): OrderDto[] {
        return orders?.filter(order => {
            return order.id.toString().includes(search?.toLowerCase()) ||
                Object.values(order.address).includes(search?.toLowerCase()) ||
                order.state.toLowerCase().includes(search?.toLowerCase()) ||
                Object.values(order.user).includes(search?.toLowerCase()) ||
                order.totalPrice.toString().toLowerCase().includes(search?.toLowerCase());
        });
    }
}
