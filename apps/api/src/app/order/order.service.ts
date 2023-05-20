import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Order } from "./order.entity";
import { CreateOrderDto, OrderDto } from "@superstore/libs";
import { EmailService } from "../email/email.service";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly emailService: EmailService,
    ) {
    }

    create(createOrderDto: CreateOrderDto): Promise<OrderDto> {
        return this.orderRepository.save(createOrderDto)
            .then((order) => {
                // Send email confirmation to user
                this.emailService.sendEmailConfirmationOrder(order);
                return order;
            });
    }

    findAll(): Promise<Order[]> {
        return this.orderRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.orderRepository.findOne(options);
    }

    update(id: number, updateOrderDto: OrderDto) {
        return this.orderRepository.update(id, updateOrderDto);
    }

    remove(id: number) {
        return this.orderRepository.delete(id);
    }

    findLast(userId: number) {
        const options: FindOneOptions = {
            where: { userId },
            order: { id: 'DESC' }
        };
        return this.orderRepository.findOne(options);
    }

    findByUser(userId: number) {
        const options: FindManyOptions = {
            where: { userId },
            order: { createdAt: 'DESC' }
        };
        return this.orderRepository.find(options);
    }
}
