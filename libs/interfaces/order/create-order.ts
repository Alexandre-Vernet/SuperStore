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

export class DeliveryMethod {
    name: DeliveryMethodType;
    expectedDelivery: DeliveryMethodExpectedDelivery;
    price: DeliveryMethodPrice;
}

export enum DeliveryMethodType {
    STANDARD = 'STANDARD',
    EXPRESS = 'EXPRESS',
}

export enum DeliveryMethodExpectedDelivery {
    STANDARD = '3-5 days',
    EXPRESS = '1-2 days',
}

export enum DeliveryMethodPrice {
    STANDARD = 5,
    EXPRESS = 16,
}
