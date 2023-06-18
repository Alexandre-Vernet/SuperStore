import { Injectable } from '@nestjs/common';
import { AddressDto, CreateAddressDto } from "@superstore/interfaces";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./address.entity";
import { faker } from '@faker-js/faker';

@Injectable()
export class AddressService {

    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>
    ) {
    }

    create(createOrderDto: CreateAddressDto): Promise<Address> {
        // If address already exists, don't create it
        const options = {
            where: {
                userId: createOrderDto.userId,
                company: createOrderDto?.company,
                address: createOrderDto.address,
                apartment: createOrderDto?.apartment,
                country: createOrderDto.country,
                city: createOrderDto.city,
                zipCode: createOrderDto.zipCode,
                phone: createOrderDto.phone,
            }
        };

        return this.addressRepository.findOne(options)
            .then(address => {
                if (!address) {
                    return this.addressRepository.save(createOrderDto)
                        .then(createdAddress => {
                            return createdAddress;
                        });
                }
                return address;
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

    update(id: number, updateAddress: AddressDto) {
        return this.addressRepository.update(id, updateAddress);
    }

    remove(id: number) {
        return this.addressRepository.delete(id);
    }


    migrate() {
        for (let i = 0; i < 25; i++) {
            const address: CreateAddressDto = {
                userId: Math.floor(Math.random() * 10) + 1,
                address: faker.address.streetAddress(),
                apartment: faker.address.secondaryAddress(),
                city: faker.address.city(),
                country: faker.address.country(),
                zipCode: faker.address.zipCode(),
                phone: `06${faker.phone.number('########')}`,
            };

            this.create(address);
        }
    }
}
