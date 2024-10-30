import { Injectable } from '@nestjs/common';
import { ProductDto } from '@superstore/interfaces';
import { FindOneOptions, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConflictException } from '../exceptions/CustomConflictException';
import { CustomNotFoundException } from '../exceptions/CustomNotFoundException';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) {
    }

    async create(createProductDto: ProductDto): Promise<ProductEntity> {
        const productExist = await this.findBy('slug', createProductDto.slug) || await this.findBy('name', createProductDto.name);
        if (productExist) {
            throw new CustomConflictException('Product already exists', 'name');
        }

        const product: ProductDto = {
            name: createProductDto.name.trim(),
            slug: createProductDto.name.trim().replace(/ /g, '-').toLowerCase(),
            description: createProductDto.description.trim(),
            price: createProductDto.price,
            category: createProductDto.category.trim(),
            images: createProductDto.images.map(i => ({ url: i.url.trim() }))
        };

        // Save product and cascade save images
        return this.productRepository.save(product);
    }


    findAll(): Promise<ProductEntity[]> {
        return this.productRepository.find();
    }

    findAllProductsWithPagination(pagination): Promise<{ products: ProductEntity[], total: number }> {
        const { limit, page } = pagination;
        return this.productRepository.findAndCount({
            skip: limit * (page - 1),
            take: limit,
            order: {
                images: {
                    id: 'ASC'
                }
            },
        }).then(([products, total]) => ({ products, total }));
    }

    findBy(key: string, value: string | number) {
        const options: FindOneOptions = {
            where: { [key]: value },
            order: {
                images: {
                    id: 'ASC'
                }
            }
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
}
