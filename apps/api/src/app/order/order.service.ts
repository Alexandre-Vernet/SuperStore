import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly productRepository: Repository<Order>
    ) {
    }

    create(createOrderDto: CreateOrderDto): Promise<Order> {
        return this.productRepository.save(createOrderDto);
    }

    findAll(): Promise<Order[]> {
        return this.productRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.productRepository.findOne(options);
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return this.productRepository.update(id, updateOrderDto);
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }
}
