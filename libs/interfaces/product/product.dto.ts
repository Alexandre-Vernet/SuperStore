import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class ProductDto extends PartialType(CreateProductDto) {
    id: number;
}
