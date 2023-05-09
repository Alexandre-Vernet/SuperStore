import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '@superstore/libs';
import { ProductDto } from '@superstore/libs';
import { FindOneOptions, Repository } from "typeorm";
import { Product } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";

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

    update(id: number, updateProductDto: ProductDto) {
        return this.productRepository.update(id, updateProductDto);
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
}
