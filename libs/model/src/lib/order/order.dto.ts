import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ProductDto } from "../product/product.dto";

export class OrderDto extends PartialType(CreateOrderDto) {
    id: number;
}

export class OrderWithProductsDto extends OrderDto  {
    products: ProductDto[];
}
