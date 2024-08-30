import { ImageDto } from '../image/image';

export class ProductDto {
    id?: number;
    images: ImageDto[];
    name: string;
    slug?: string;
    description: string;
    price: number;
    category: string;
    quantity?: number;
    size?: string;
}
