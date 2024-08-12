import { Injectable } from '@nestjs/common';
import { ImageDto, ProductDto } from '@superstore/interfaces';
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

    async create(createProductDto: ProductDto): Promise<Product> {
        const productExist = await this.findBy('slug', createProductDto.slug) || await this.findBy('name', createProductDto.name);
        if (productExist) {
            throw new CustomConflictException('Product already exists', 'name');
        }

        const product: ProductDto = {
            name: createProductDto.name.trim(),
            slug: createProductDto.name.trim().replace(/ /g, '-').toLowerCase(),
            description: createProductDto.description.trim(),
            price: createProductDto.price,
            categories: createProductDto.categories.map(c => c.trim()),
            images: createProductDto.images.map(i => ({ url: i.url.trim() }))
        };

        // Save product and cascade save images
        return this.productRepository.save(product);
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
        const existingProduct: ProductDto = await this.findBy('id', id);
        if (!existingProduct) {
            throw new CustomNotFoundException('Product not found', 'name');
        }

        if (existingProduct.name !== updateProductDto.name) {
            const productWithSameName = await this.findBy('name', updateProductDto.name);
            if (productWithSameName) {
                throw new CustomConflictException('Product already exists', 'name');
            }
        }

        updateProductDto.images.forEach((image, index) => {
            image.id = existingProduct.images[index].id;
            image.product = existingProduct;
        });

        return this.productRepository.save({ id, ...updateProductDto });
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }

    async migrate() {
        // eslint-disable-next-line no-console
        console.log('Migrating products...');

        for (let i = 0; i < 200; i++) {
            const randomNumberCategories = Math.floor(Math.random() * 3) + 1;
            const categories: string[] = [];
            for (let j = 0; j < randomNumberCategories; j++) {
                categories.push(faker.commerce.department());
            }

            const images: ImageDto[] = [];
            for (let j = 0; j < 3; j++) {
                images.push({
                    url: faker.image.imageUrl()
                });
            }
            const product: ProductDto = {
                name: faker.commerce.productName(),
                slug: faker.commerce.productName().replace(/ /g, '-').toLowerCase(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price()),
                categories: categories,
                images
            };

            await this.create(product);
        }
    }
}
