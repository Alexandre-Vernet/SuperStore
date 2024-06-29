import { OrderState } from './state';
import { AddressDto } from '../address/address';
import { UserDto } from '../user/user';
import { ProductDto } from '../product/product';

export class OrderDto {
    id: number;
    user: UserDto;
    address: AddressDto;
    products: ProductDto[];
    state: OrderState;
    deliveryMethod: string;
    paymentMethod: string;
    subTotalPrice: number;
    shippingPrice: number;
    taxesPrice: number;
    totalPrice: number;
    createdAt: Date;
}

export class OrderProductDto extends OrderDto {
    productIds: number[];
}