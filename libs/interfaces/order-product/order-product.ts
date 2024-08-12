import { ProductDto } from '../product/product';
import { OrderDto } from '../order/order';

export class OrderProductDto {
    id?: number;
    order?: OrderDto;
    product: ProductDto;
}