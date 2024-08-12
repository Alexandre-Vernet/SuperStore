import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Order } from './order.entity';
import { AddressDto, DeliveryMethodType, OrderDto, OrderState, ProductDto, UserDto } from '@superstore/interfaces';
import { faker } from '@faker-js/faker';
import { AddressService } from '../address/address.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly addressService: AddressService,
    ) {
    }

    async create(order: OrderDto) {
        const throwIfExist = false;
        order.address = await this.addressService.create(order.address, throwIfExist);
        return await this.orderRepository.save(order);
    }

    findAll(): Promise<Order[]> {
        // Order by id ASC
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        };

        return this.orderRepository.find(options);
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.orderRepository.findOne(options);
    }

    async updateOrderState(id: number, updateOrderDto: OrderState) {
        await this.orderRepository.update(id, {state: updateOrderDto});
        return this.orderRepository.findOne({
            where: { id }
        });
    }

    remove(id: number) {
        return this.orderRepository.delete(id);
    }

    getLastOrder(userId: number) {
        const options: FindOneOptions = {
            where: {
                user: {
                    id: userId
                }
            },
            order: { createdAt: 'DESC' }
        };
        return this.orderRepository.findOne(options);
    }

    getUserOrders(userId: number) {
        const options: FindManyOptions = {
            where: {
                user: {
                    id: userId
                }
            },
            order: { createdAt: 'DESC' }
        };
        return this.orderRepository.find(options);
    }

    async migrate() {
        // eslint-disable-next-line no-console
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


            const order: ProductDto = {
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
