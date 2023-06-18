import { CreateReviewDto } from './create-review';
import { UserDto } from "../user/user";

export class ReviewDto extends CreateReviewDto {
    id: number;
    createdAt: Date;
}


export class ReviewWithUserDto extends ReviewDto {
    user: UserDto;
}
