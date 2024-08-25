import { Injectable } from '@nestjs/common';
import { ProductDto, ReviewDto, UserDto } from '@superstore/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { faker } from '@faker-js/faker';

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


    async migrate() {
        // eslint-disable-next-line no-console

        for (let i = 0; i < 10; i++) {
            const user: UserDto = new UserDto();
            user.id = faker.datatype.number({ min: 1, max: 300 });
            const product: ProductDto = new ProductDto();
            product.id = 6;
            const review: ReviewDto = {
                user: user,
                product: product,
                rating: faker.datatype.number({ min: 1, max: 5 }),
                description: faker.lorem.paragraph(),
                createdAt: faker.date.past()
            };

        await this.create(review);
        }
    }
}
