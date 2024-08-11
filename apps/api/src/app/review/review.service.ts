import { Injectable } from '@nestjs/common';
import { ProductDto, ReviewDto, UserDto } from '@superstore/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Review } from './review.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ) {
    }

    create(createReviewDto:ReviewDto): Promise<ReviewDto> {
        return this.reviewRepository.save(createReviewDto)
            .then(review => {
                return this.findOne(review.id);
            });
    }


    findReviewsForProduct(productId: number) {
        const options: FindManyOptions = {
            where: { product: { id: productId } },
        };

        return this.reviewRepository.find(options);
    }


    findOne(id: number) {
        const options = {
            where: { id }
        };
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

        for (let i = 0; i < 300; i++) {
            const user: UserDto = new UserDto();
            user.id = faker.datatype.number({ min: 1, max: 100 });
            const product: ProductDto = new ProductDto();
            product.id = faker.datatype.number({ min: 1, max: 150 });
            const review: ReviewDto = {
                user: user,
                product: product,
                rating: faker.datatype.number({ min: 1, max: 5 }),
                description: faker.lorem.paragraph(),
                createdAt: faker.date.past()
            };

            this.create(review);
        }
    }
}
