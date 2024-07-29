import { ProductSizeDto } from './product-size';

export class ProductDto {
    id?: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    categories: string[];
    images: string[];
    quantity?: number;
    size?: ProductSizeDto;
}
