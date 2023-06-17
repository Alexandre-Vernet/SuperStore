import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { UserDto } from "../user/user.dto";

export class ReviewDto extends PartialType(CreateReviewDto) {
    id: number;
    createdAt: Date;
}


export class ReviewWithUserDto extends ReviewDto {
    user: UserDto;
}
