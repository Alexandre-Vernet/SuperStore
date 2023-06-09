import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from '@superstore/libs';
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new ConflictException('This email is already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        if (!hashedPassword) {
            throw new ConflictException('Error hashing password');
        }
        createUserDto.password = hashedPassword;

        return this.userRepository.save(createUserDto);
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
        return this.userRepository.findOne(options);
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
