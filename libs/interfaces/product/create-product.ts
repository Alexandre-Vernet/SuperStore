export class CreateProductDto {
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string[];
    images: string[];
}
