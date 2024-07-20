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

    create(createOrderDto: Omit<AddressDto, 'id'>): Promise<AddressDto> {
       return this.addressRepository.save(createOrderDto)
    }

    findAllUserAddress(userId: number): Promise<AddressDto[]> {
        return this.addressRepository.find({ where: { user: { id: userId } } });
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
        const user: UserDto = await this.userService.find(1);

        for (let i = 0; i < 25; i++) {
            const address: Omit<AddressDto, 'id'> = {
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
