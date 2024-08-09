import { Injectable } from '@nestjs/common';
import { AddressDto, UserDto } from '@superstore/interfaces';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { faker } from '@faker-js/faker';
import { UserService } from '../user/user.service';

@Injectable()
export class AddressService {

    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
        private readonly userService: UserService
    ) {
    }

    async create(address: AddressDto): Promise<AddressDto> {
        const addressExist = await this.findUniqueAddress(address);
        if (addressExist) {
            throw new Error('Address already exist');
        }
        return this.addressRepository.save(address);
    }

    getUserAddresses(userId: number): Promise<AddressDto[]> {
        return this.addressRepository.find({ where: { user: { id: userId } } });
    }


    find(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };

        return this.addressRepository.findOne(options);
    }

    findUniqueAddress(address: AddressDto): Promise<AddressDto> {
        const options: FindOneOptions = {
            where: {
                address: address.address,
                country: address.country,
                city: address.city,
                zipCode: address.zipCode,
                phone: address.phone,
                user: address.user
            }
        };

        return this.addressRepository.findOne(options);
    }

    async update(id: number, updateAddress: AddressDto): Promise<AddressDto> {
        return this.addressRepository.save({ id, ...updateAddress });
    }

    remove(id: number) {
        return this.addressRepository.delete(id);
    }


    async migrate() {
        console.log('Migrating addresses...');
        const user: UserDto = await this.userService.find(1);

        for (let i = 0; i < 25; i++) {
            const address: AddressDto = {
                user,
                address: faker.address.streetAddress(),
                apartment: faker.address.secondaryAddress(),
                city: faker.address.city(),
                country: faker.address.country(),
                zipCode: faker.address.zipCode(),
                phone: `06${ faker.phone.number('########') }`
            };

            await this.create(address);
        }
    }
}
