import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ProductDto } from "../product/product.dto";

export class OrderDto extends PartialType(CreateOrderDto) {
    id: number;
    createdAt: Date;
}

export class OrderWithProductsDto extends OrderDto  {
    products: ProductDto[];
}

export class OrderWithAddressAndUserDto extends OrderDto  {
    address: string;
    user: string;
    products: ProductDto[];
}
