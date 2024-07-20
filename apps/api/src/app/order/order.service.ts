import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Order } from './order.entity';
import {
    AddressDto,
    DeliveryMethodType,
    OrderDto, OrderProductDto,
    OrderState,
    UserDto
} from '@superstore/interfaces';
import { EmailService } from '../email/email.service';
import { faker } from '@faker-js/faker';
import { UserService } from '../user/user.service';
import { AddressService } from '../address/address.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly emailService: EmailService,
        private readonly userService: UserService,
        private readonly addressService: AddressService,
        private readonly productService: ProductService
    ) {
    }

    create(createOrderDto: Omit<OrderDto, 'id'>): Promise<OrderDto> {
        return this.orderRepository.save(createOrderDto)
            .then((order: OrderDto) => {
                const NODE_ENV = process.env.NODE_ENV;
                if (NODE_ENV === 'development') {
                    return order;
                }

                // Get user from order id
                return this.userService.find(order.user.id)
                    .then(user => {
                        this.emailService.sendEmailConfirmationOrder(order, user);
                        return order;
                    })
            });
    }

    findAll(): Promise<Order[]> {
        // Order by id ASC
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        };

        return this.orderRepository.find(options);
    }

    findAllOrderProducts(): Promise<OrderDto[]> {
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        };

        return this.orderRepository.find(options)
            .then((orders: OrderDto[]) => {
                return orders;
            });
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.orderRepository.findOne(options);
    }

    update(id: number, updateOrderDto: OrderDto) {
        return this.orderRepository.update(id, updateOrderDto)
            .then(() => this.findOne(id));
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

    async migrate() {
        console.log('Migrating orders...');

        for (let i = 0; i < 100; i++) {
            // Product id
            const productIds = [];
            const randomNumberGenerateProductId = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < randomNumberGenerateProductId; j++) {
                productIds.push(Math.floor(Math.random() * 10) + 1);
            }

            // Delivery method
            const randomNumberGenerateDeliveryMethod = Math.floor(Math.random() * 2) + 1;
            const deliveryMethod = randomNumberGenerateDeliveryMethod === 1 ? DeliveryMethodType.STANDARD : DeliveryMethodType.EXPRESS;

            // State
            const randomNumberGenerateState = Math.floor(Math.random() * 3) + 1;
            let state: OrderState;
            switch (randomNumberGenerateState) {
                case 1:
                    state = OrderState.PENDING;
                    break;
                case 2:
                    state = OrderState.CONFIRMED;
                    break;
                case 3:
                    state = OrderState.SHIPPED;
                    break;
                case 4:
                    state = OrderState.DELIVERED;
                    break;
                case 5:
                    state = OrderState.CANCELED;
                    break;
                default:
                    state = OrderState.PENDING;
            }

            // Payment method
            const randomNumberGeneratePaymentMethod = Math.floor(Math.random() * 2) + 1;
            const paymentMethod = randomNumberGeneratePaymentMethod === 1 ? 'Paypal' : 'Credit card';

            const user: UserDto = new UserDto();
            user.id = Math.floor(Math.random() * 10) + 1;
            const address: AddressDto = new AddressDto();
            address.id = Math.floor(Math.random() * 10) + 1;


            const order: Omit<OrderDto, 'id'> = {
                user,
                address,
                productIds,
                deliveryMethod,
                state,
                paymentMethod,
                taxesPrice: Number(faker.commerce.price()),
                shippingPrice: Number(faker.commerce.price()),
                subTotalPrice: Number(faker.commerce.price()),
                totalPrice: Number(faker.commerce.price()),
                createdAt: new Date()
            }


            await this.create(order);
        }
    }
}
