import { UserDto } from '../user/user';
import { ProductDto } from '../product/product';

export class ReviewDto {
    id?: number;
    product: ProductDto;
    user: UserDto;
    rating: number;
    description: string;
    createdAt: Date;
}