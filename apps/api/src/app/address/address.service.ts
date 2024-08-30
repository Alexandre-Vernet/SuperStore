import { Injectable } from '@nestjs/common';
import { AddressDto } from '@superstore/interfaces';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './address.entity';

@Injectable()
export class AddressService {

    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>
    ) {
    }

    async create(address: AddressDto, throwIfExist = true): Promise<AddressDto> {
        const addressExist = await this.findUniqueAddress(address);
        if (addressExist) {
            if (throwIfExist) {
                throw new Error('Address already exist');
            }
            return addressExist;
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
                user: {
                    id: address.user.id
                }
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
}
