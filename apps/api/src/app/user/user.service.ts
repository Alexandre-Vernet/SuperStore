import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from '@superstore/interfaces';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
    }

    async findAll(): Promise<UserEntity[]> {
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        };
        const users = await this.userRepository.find(options);
        users.map(user => delete user.password);
        return users;
    }

    async find(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        const user = await this.userRepository.findOne(options);
        delete user.password;
        return user;
    }

    async update(id: number, updateUserDto: UserDto): Promise<UserDto> {
        // Check that the email is not already in use
        const options: FindOneOptions = {
            where: {
                email: updateUserDto.email,
                id: Not(id)
            }
        };

        const emailAlreadyInUse = await this.userRepository.findOne(options);
        if (emailAlreadyInUse) {
            throw new ConflictException(`Email ${ updateUserDto.email } is already in use`);
        }

        return this.userRepository.save({ id, ...updateUserDto });

    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }
}
