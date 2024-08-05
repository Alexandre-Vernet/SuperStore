import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './order-product.entity';
import { Repository } from 'typeorm';
import { OrderProductDto } from '@superstore/interfaces';
import { OrderService } from '../order/order.service';

@Injectable()
export class OrderProductService {

    constructor(
        @InjectRepository(OrderProduct)
        private readonly orderProductRepository: Repository<OrderProduct>,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService
    ) {
    }

    async create(orderProduct: OrderProductDto): Promise<void> {
        const order = await this.orderService.findOne(orderProduct.id);

        if (!order) {
            throw new Error(`Order with id ${orderProduct.order.id} not found`);
        }

        // Créez une instance de OrderProduct avec l'entité Order trouvée
        const newOrderProduct = this.orderProductRepository.create({
            ...orderProduct,
            order,
            products: orderProduct.products
        });

        console.log(newOrderProduct);

        await this.orderProductRepository.save(newOrderProduct);
    }

}
