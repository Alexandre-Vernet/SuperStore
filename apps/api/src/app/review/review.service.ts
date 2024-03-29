import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto, ReviewDto } from "@superstore/interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Review } from "./review.entity";
import { faker } from '@faker-js/faker';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) {
    }

    create(createReviewDto: CreateReviewDto): Promise<ReviewDto> {
        if (createReviewDto.description.length > 1000) {
            throw new HttpException('Description is too long', 400);
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


    async migrate() {
        console.log('Migrating reviews...');

        await this.reviewRepository.query(`
        CREATE TABLE IF NOT EXISTS public.reviews (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);

        for (let i = 0; i < 300; i++) {
            const review: CreateReviewDto = {
                productId: faker.datatype.number({ min: 1, max: 150 }),
                description: faker.lorem.paragraph(),
                rating: faker.datatype.number({ min: 1, max: 5 }),
                userId: faker.datatype.number({ min: 1, max: 80 }),
            }

            this.create(review);
        }
    }
}
