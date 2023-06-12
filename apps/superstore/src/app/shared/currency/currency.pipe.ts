import { Pipe, PipeTransform } from '@angular/core';
import { OrderWithAddressAndUserDto } from "@superstore/libs";

@Pipe({
    name: 'searchOrders'
})
export class CurrencyPipe implements PipeTransform {
    transform(search: string, orders: OrderWithAddressAndUserDto[]) {

    }
}
