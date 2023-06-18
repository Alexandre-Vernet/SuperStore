import { Injectable } from '@nestjs/common';
import { UserDto } from '@superstore/interfaces';
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find()
            .then((users) => {
                return users.map((user) => {
                    delete user.password;
                    return user;
                });
            });
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.userRepository.findOne(options)
            .then(user => {
                delete user.password;
                return user;
            });
    }

    update(id: number, updateUserDto: UserDto): Promise<UserDto> {
        return this.userRepository.update(id, updateUserDto)
            .then(() => {
                return this.findOne(id);
            });
    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }
}
