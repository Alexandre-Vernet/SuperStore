import { ProductDto } from "../product/product";
import { ProductSizeDto } from "../product/product-size";

export class CartDto extends ProductDto {
    quantity: number;
    size: ProductSizeDto;
}
