import { ConflictException, Injectable } from '@nestjs/common';
import { ProductDto } from '@superstore/interfaces';
import { FindOneOptions, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CustomConflictException } from '../exceptions/CustomConflictException';
import { CustomNotFoundException } from '../exceptions/CustomNotFoundException';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {
    }

    async create(createProductDto: ProductDto): Promise<ProductDto> {
        const productExist = await this.findBy('slug', createProductDto.slug) || await this.findBy('name', createProductDto.name);
        if (productExist) {
            throw new CustomConflictException('Product already exists', 'name');
        }
        return this.productRepository.save(createProductDto);
    }

    findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    findAllProductsWithPagination(pagination): Promise<{ products: Product[], total: number }> {
        const { limit, page } = pagination;
        return this.productRepository.findAndCount({
            skip: limit * (page - 1),
            take: limit
        }).then(([products, total]) => ({ products, total }));
    }

    findBy(key: string, value: string | number) {
        const options: FindOneOptions = {
            where: { [key]: value }
        };

        return this.productRepository.findOne(options);
    }

    async update(id: number, updateProductDto: ProductDto): Promise<ProductDto> {
        const existingProduct = await this.findBy('id', id);
        if (!existingProduct) {
            throw new CustomNotFoundException('Product not found', 'name');
        }

        if (existingProduct.name !== updateProductDto.name) {
            const productWithSameName = await this.findBy('name', updateProductDto.name);
            if (productWithSameName) {
                throw new CustomConflictException('Product already exists', 'name');
            }
        }

        await this.productRepository.update(id, updateProductDto);
        return this.findBy('id', id);
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }

    async migrate() {
        console.log('Migrating products...');

        for (let i = 0; i < 200; i++) {
            const randomNumberCategories = Math.floor(Math.random() * 3) + 1;
            const categories: string[] = [];
            for (let j = 0; j < randomNumberCategories; j++) {
                categories.push(faker.commerce.department());
            }

            const productName = faker.commerce.productName();
            const product: ProductDto = {
                name: productName,
                slug: productName.replace(/ /g, '-').toLowerCase(),
                description: faker.commerce.productDescription(),
                price: Number(faker.commerce.price()),
                categories: categories,
                images: [faker.image.imageUrl()]
            };

            this.create(product);
        }
    }
}
