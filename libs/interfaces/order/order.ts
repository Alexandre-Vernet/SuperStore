import { OrderState } from './state';
import { AddressDto } from '../address/address';
import { UserDto } from '../user/user';
import { OrderProductDto } from '../order-product/order-product';
import { PromotionDto } from "../promotion/promotion";

export class OrderDto {
    id?: number;
    user: UserDto;
    address: AddressDto;
    products: OrderProductDto[];
    promotion?: PromotionDto;
    state: OrderState;
    deliveryMethod: string;
    subTotalPrice: number;
    shippingPrice: number;
    taxesPrice: number;
    totalPrice: number;
    createdAt: Date;
}