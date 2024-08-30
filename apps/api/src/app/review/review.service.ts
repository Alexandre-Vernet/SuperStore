import { Injectable } from '@nestjs/common';
import { ReviewDto } from '@superstore/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(ReviewEntity)
        private readonly reviewRepository: Repository<ReviewEntity>
    ) {
    }

    async create(createReviewDto: ReviewDto): Promise<ReviewDto> {
        // Check if review already exists for this user and product
        const options = {
            where: {
                user: { id: createReviewDto.user.id },
                product: { id: createReviewDto.product.id }
            }
        };
        const reviewExist = await this.reviewRepository.findOne(options);
        if (reviewExist) {
            throw new Error('Review already exists');
        }
        return this.reviewRepository.save({ id: createReviewDto.id, ...createReviewDto });
    }


    findReviewsForProduct(productId: number) {
        const options: FindManyOptions = {
            where: { product: { id: productId } }
        };

        return this.reviewRepository.find(options);
    }


    findOne(id: number) {
        const options = {
            where: { id }
        };
        return this.reviewRepository.findOne(options);
    }

    remove(id: number) {
        return this.reviewRepository.delete(id);
    }

    findReviewsForAllProducts() {
        return this.reviewRepository.find();
    }
}
