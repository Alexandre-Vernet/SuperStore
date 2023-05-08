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
    deliveryMethod: string;
    paymentMethod: string;
}
