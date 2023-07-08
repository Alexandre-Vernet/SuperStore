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

    findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    findAllProductsWithPagination(pagination): Promise<{ products: Product[], total: number }> {
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
        const options: FindOneOptions = {
            where: { slug }
        };

        return this.productRepository.findOne(options);
    }

    getProductsByIds(ids: number[]) {
        return this.productRepository.find({
            where: {
                id: In(ids),
            },
        });
    }

    async migrate() {
        console.log('Migrating products...');

        for (let i = 0; i < 200; i++) {
            const randomNumberCategories = Math.floor(Math.random() * 3) + 1;
            const categories = [];
            for (let j = 0; j < randomNumberCategories; j++) {
                categories.push(faker.commerce.department());
            }

            const productName = faker.commerce.productName();
            const product: CreateProductDto = {
                name: productName,
                slug: productName.replace(/ /g, '-').toLowerCase(),
                description: faker.commerce.productDescription(),
                price: Number(faker.commerce.price()),
                category: categories,
                images: [faker.image.imageUrl()]
            };

            this.create(product);
        }
    }
}
