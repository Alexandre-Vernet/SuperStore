import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './order-product.entity';
import { Repository } from 'typeorm';
import { OrderProductDto } from '@superstore/interfaces';

@Injectable()
export class OrderProductService {

    constructor(
        @InjectRepository(OrderProduct)
        private readonly orderProductRepository: Repository<OrderProduct>
    ) {
    }

    async create(orderProduct: OrderProductDto[]): Promise<void> {
        console.log(orderProduct);
        await this.orderProductRepository.save(orderProduct);
    }

}
