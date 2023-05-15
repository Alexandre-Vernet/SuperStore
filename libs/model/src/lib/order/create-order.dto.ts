import { State } from './state.dto';

export class CreateOrderDto {
    userId: number;
    state: State;
    addressId: number;
    deliveryMethod: string;
    paymentMethod: string;
}

export class DeliveryMethod {
    name: string;
    expectedDelivery: string;
    price: number;
}
