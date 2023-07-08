import { CreateOrderDto } from './create-order';
import { ProductDto } from "../product/product";
import { AddressWithShortAddressDto } from "../address/create-address";
import { UserWithShortUserDto } from "../user/create-user";

export class OrderDto extends CreateOrderDto {
    id: number;
    createdAt: Date;
}

export class OrderWithProductsDto extends OrderDto {
    products: ProductDto[];
}

export class OrderWithAddressAndUserDto extends OrderDto {
    address: string;
    user: string;
    products: ProductDto[];
}


export class OrderWithAddressAndUserAndProductsDto extends OrderDto {
    address: AddressWithShortAddressDto;
    user: UserWithShortUserDto;
    products: ProductDto[];
}
