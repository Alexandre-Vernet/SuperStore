import { CreateOrderDto } from './create-order';
import { ProductDto } from "../product/product";

export class OrderDto extends CreateOrderDto {
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
