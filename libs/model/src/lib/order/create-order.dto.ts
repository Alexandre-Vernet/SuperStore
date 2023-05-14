import { State } from './state.dto';

export class CreateOrderDto {
    state: State;
    company?: string;
    address: string;
    apartment?: string;
    country: string;
    city: string;
    postalCode: string;
    phone: string;
    deliveryMethod: DeliveryMethod;
    paymentMethod: string;
}

export class DeliveryMethod {
    name: string;
    expectedDelivery: string;
    price: number;
}
