import { Injectable } from '@nestjs/common';
import { AddressDto, CreateAddressDto } from "@superstore/interfaces";
import { FindManyOptions, FindOneOptions, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./address.entity";
import { faker } from '@faker-js/faker';
import { UserService } from "../user/user.service";

@Injectable()
export class AddressService {

    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        private readonly userService: UserService
    ) {
    }

    create(createOrderDto: CreateAddressDto, userId: number): Promise<Address> {
        const options = {
            where: {
                company: createOrderDto?.company,
                address: createOrderDto.address,
                apartment: createOrderDto?.apartment,
                country: createOrderDto.country,
                city: createOrderDto.city,
                zipCode: createOrderDto.zipCode,
                phone: createOrderDto.phone,
            }
        };

        // Check if address already exists
        return this.addressRepository.findOne(options)
            .then(address => {
                // If address does not exist, create it
                if (!address) {
                    return this.addressRepository.save(createOrderDto)
                        .then(createdAddress => {
                            const option: FindOneOptions = {
                                where: {
                                    id: createdAddress.id
                                }
                            };

                            // Get the address id
                            return this.addressRepository.findOne(option)
                                .then(address => {
                                    // Link address to user
                                    this.userService.linkAddress(userId, address.id)
                                        .then(() => {
                                            return createdAddress;
                                        });
                                    return createdAddress;
                                })
                                .catch(error => {
                                    throw error;
                                });
                        })
                        .catch(error => {
                            throw error;
                        })
                }
                return address;
            });
    }

    findAllUserAddress(userId: number): Promise<AddressDto[]> {
        return this.userService.findOne(userId)
            .then(user => {
                const option: FindManyOptions = {
                    where: { id: In(user.addressesId) }
                };

                return this.addressRepository.find(option);
            });
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


    async migrate() {
        console.log('Migrating addresses...');

        for (let i = 0; i < 25; i++) {
            const address: CreateAddressDto = {
                address: faker.address.streetAddress(),
                apartment: faker.address.secondaryAddress(),
                city: faker.address.city(),
                country: faker.address.country(),
                zipCode: faker.address.zipCode(),
                phone: `06${ faker.phone.number('########') }`,
            };

            const userId = faker.datatype.number({ min: 1, max: 25 });
            await this.create(address, userId);
        }
    }
}
