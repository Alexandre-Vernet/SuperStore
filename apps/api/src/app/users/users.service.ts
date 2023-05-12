import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@superstore/libs';
import { UserDto } from '@superstore/libs';
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
    }

    create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new ConflictException('This email is already taken');
        }

        return this.userRepository.save(createUserDto);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.userRepository.findOne(options);
    }

    update(id: number, updateUserDto: UserDto) {
        return this.userRepository.update(id, updateUserDto);
    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }
}
