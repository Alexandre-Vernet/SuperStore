import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductDto } from '@superstore/interfaces';
import { FindOneOptions, In, Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {
    }

    create(createProductDto: CreateProductDto): Promise<Product> {
        return this.productRepository.save(createProductDto);
    }

    findAll(pagination): Promise<{ products: Product[], total: number }> {
        const { limit, page } = pagination;
        return this.productRepository.findAndCount({
            skip: limit * (page - 1),
            take: limit,
        }).then(([products, total]) => ({ products, total }));
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.productRepository.findOne(options);
    }

    update(id: number, updateProductDto: ProductDto): Promise<ProductDto> {
        return this.productRepository.update(id, updateProductDto)
            .then(() => this.findOne(id));
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }

    findBySlug(slug: string) {
        // Remove all the '-' from the slug
        slug = slug.replace(/-/g, ' ');

        // Find in DB where name is like slug
        return this.productRepository.createQueryBuilder('products')
            .where('LOWER(products.name) LIKE LOWER(:slug)', { slug: `%${ slug }%` })
            .getOne();
    }

    getProductsByIds(ids: number[]) {
        return this.productRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    migrate() {
        for (let i = 0; i < 150; i++) {

            const randomNumberCategories = Math.floor(Math.random() * 3) + 1;
            const categories = [];
            for (let j = 0; j < randomNumberCategories; j++) {
                categories.push(faker.commerce.department());
            }

            const product: CreateProductDto = {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: Number(faker.commerce.price()),
                category: categories,
            };

            this.create(product);
        }
    }
}
