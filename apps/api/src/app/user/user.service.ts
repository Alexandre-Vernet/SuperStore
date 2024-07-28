import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from '@superstore/interfaces';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async findAll(): Promise<User[]> {
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        }
        return this.userRepository.find(options)
            .then((users) => {
                return users.map((user) => {
                    delete user.password;
                    return user;
                });
            });
    }

    async find(id: number) {
        const options: FindOneOptions = {
            where: { id },
            relations: ['addresses']
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

        return this.userRepository
            .update(id, updateUserDto)
            .then(() => updateUserDto)
            .catch((err) => {
                throw new Error(err.message);
            });

    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }
}
