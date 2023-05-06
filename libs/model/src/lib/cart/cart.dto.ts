import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from "../product/product.dto";

export class CartDto extends PartialType(ProductDto) {
    quantity: number;
}
