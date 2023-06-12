import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

export class ReviewDto extends PartialType(CreateReviewDto) {
    id: number;
    createdAt: Date;
}
