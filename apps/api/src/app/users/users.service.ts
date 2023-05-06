import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@superstore/libs';
import { UserDto } from '@superstore/libs';
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly productRepository: Repository<User>
    ) {
    }

    create(createUserDto: CreateUserDto): Promise<User> {
        return this.productRepository.save(createUserDto);
    }

    findAll(): Promise<User[]> {
        return this.productRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.productRepository.findOne(options);
    }

    update(id: number, updateUserDto: UserDto) {
        return this.productRepository.update(id, updateUserDto);
    }

    remove(id: number) {
        return this.productRepository.delete(id);
    }
}
