import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { CreateOrderDto, NotificationsDto } from "@superstore/libs";
import { OrderDto } from "@superstore/libs";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly productRepository: Repository<Order>
    ) {
    }

    create(createOrderDto: CreateOrderDto): Promise<NotificationsDto> {
        return this.productRepository.save(createOrderDto)
            .then(() => {
                const message: NotificationsDto = {
                    title: 'Success',
                    description: 'An email has been sent to you with the order details',
                    orderCompleted: true
                };
                return message;
            })
            .catch(() => {
                const message: NotificationsDto = {
                    title: 'Error',
                    description: 'An error has occurred',
                    orderCompleted: false
                };
                return message;
            });
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

    update(id: number, updateOrderDto: OrderDto) {
        return this.productRepository.update(id, updateOrderDto);
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }
}
