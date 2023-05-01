import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindOneOptions, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
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

    findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.productRepository.findOne(options);
    }

    update(id: number, updateProductDto: UpdateProductDto) {
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
            .where('LOWER(products.name) LIKE LOWER(:slug)', { slug: `%${slug}%` })
            .getOne();
    }
}
