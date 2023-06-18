import { Injectable } from '@nestjs/common';
import { CreateReviewDto, ReviewDto } from "@superstore/interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Review } from "./review.entity";


@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) {
    }

    create(createReviewDto: CreateReviewDto): Promise<ReviewDto> {
        if (createReviewDto.description.length > 1000) {
            throw new Error('Description is too long');
        }
        return this.reviewRepository.save(createReviewDto)
            .then(review => {
                return this.findOne(review.id);
            });
    }


    findReviewsForProduct(productId: number) {
        const options: FindManyOptions = {
            where: { productId },
        };

        return this.reviewRepository.find(options);
    }


    findOne(id: number) {
        const options = {
            where: { id },
        }
        return this.reviewRepository.findOne(options);
    }

    update(id: number, updateReviewDto: ReviewDto) {
        return this.reviewRepository.update(id, updateReviewDto);
    }

    remove(id: number) {
        return this.reviewRepository.delete(id);
    }

    findReviewsForAllProducts() {
        return this.reviewRepository.find();
    }
}
