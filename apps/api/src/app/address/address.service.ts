import { Injectable } from '@nestjs/common';
import { AddressDto, CreateAddressDto, OrderDto } from "@superstore/libs";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./address.entity";

@Injectable()
export class AddressService {

    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>
    ) {
    }

    create(createOrderDto: CreateAddressDto) {
        // If address already exists, don't create it
        const options = {
            where: {
                userId: createOrderDto.userId,
                company: createOrderDto?.company,
                address: createOrderDto.address,
                apartment: createOrderDto?.apartment,
                country: createOrderDto.country,
                city: createOrderDto.city,
                postalCode: createOrderDto.postalCode,
                phone: createOrderDto.phone,
            }
        };
        this.addressRepository.findOne(options)
            .then(address => {
                if (!address) {
                    this.addressRepository.save(createOrderDto);
                }
            });
    }

    findAll(userId: number): Promise<AddressDto[]> {
        const options = {
            where: { userId }
        }
        return this.addressRepository.find(options);
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.addressRepository.findOne(options);
    }

    update(id: number, updateOrderDto: OrderDto) {
        return this.addressRepository.update(id, updateOrderDto);
    }

    remove(id: number) {
        return this.addressRepository.delete(id);
    }
}
