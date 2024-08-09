import { ProductSizeDto } from './product-size';
import { ImageDto } from '../image/image';

export class ProductDto {
    id?: number;
    images: ImageDto[];
    name: string;
    slug?: string;
    description: string;
    price: number;
    categories: string[];
    quantity?: number;
    size?: ProductSizeDto;
}
