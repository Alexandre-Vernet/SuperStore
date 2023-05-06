import { Injectable } from '@nestjs/common';
import { CreateCartDto } from '@superstore/libs';
import { CartDto } from '@superstore/libs';
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Cart } from "./entities/cart.entity";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly productRepository: Repository<Cart>
    ) {
    }

    create(createCartDto: CreateCartDto): Promise<Cart> {
        return this.productRepository.save(createCartDto);
    }

    findAll(): Promise<Cart[]> {
        return this.productRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.productRepository.findOne(options);
    }

    update(id: number, updateCartDto: CartDto) {
        return this.productRepository.update(id, updateCartDto);
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }
}
