import { OrderState } from './state';

export class CreateOrderDto {
    userId: number;
    state: OrderState;
    addressId: number;
    productsId: number[];
    deliveryMethod: string;
    paymentMethod: string;
    subTotalPrice: number;
    shippingPrice: number;
    taxesPrice: number;
    totalPrice: number;
}
