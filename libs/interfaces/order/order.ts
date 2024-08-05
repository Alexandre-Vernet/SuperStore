import { OrderState } from './state';
import { AddressDto } from '../address/address';
import { UserDto } from '../user/user';
import { OrderProductDto } from '../order-product/order-product';

export class OrderDto {
    id?: number;
    user: UserDto;
    address: AddressDto;
    orderProducts: OrderProductDto[];
    state: OrderState;
    deliveryMethod: string;
    paymentMethod: string;
    subTotalPrice: number;
    shippingPrice: number;
    taxesPrice: number;
    totalPrice: number;
    createdAt: Date;
}