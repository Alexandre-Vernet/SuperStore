import { Injectable } from '@nestjs/common';
import { CreateReviewDto, ReviewDto } from "@superstore/libs";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Review } from "./review.entity";


@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly productRepository: Repository<Review>
    ) {
    }

    create(createReviewDto: CreateReviewDto) {
        return this.productRepository.save(createReviewDto);
    }


    findReviewsForProduct(productId: number) {
        const options: FindManyOptions = {
            where: { productId },
        };

        return this.productRepository.find(options);
    }


    findOne(id: number) {
        const options = {
            where: { id },
        }
        return this.productRepository.findOne(options);
    }

    update(id: number, updateReviewDto: ReviewDto) {
        return this.productRepository.update(id, updateReviewDto);
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }
}
