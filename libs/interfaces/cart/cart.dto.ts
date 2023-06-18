import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from "../product/product.dto";
import { ProductSizeDto } from "../product/product-size.dto";

export class CartDto extends PartialType(ProductDto) {
    quantity: number;
    size: ProductSizeDto;
}
