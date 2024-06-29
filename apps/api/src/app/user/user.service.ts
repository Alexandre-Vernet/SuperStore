import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from '@superstore/interfaces';
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Not, Repository } from "typeorm";

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
        // Check that the email is not already in use
        const options: FindOneOptions = {
            where: {
                email: updateUserDto.email,
                id: Not(id)
            }
        };

        return this.userRepository.findOne(options)
            .then(user => {
                if (user && user.id !== id) {
                    throw new ConflictException(`Email ${ updateUserDto.email } is already in use`);
                }

                return this.userRepository
                    .update(id, updateUserDto)
                    .then(() => {
                        return this.userRepository.findOne({ where: { id } })
                            .then((user) => {
                                delete user.password;
                                return user;
                            });
                    })
                    .catch((err) => {
                        throw new Error(err.message);
                    });
            })

    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }

    linkAddress(userId: number, addressId: number): Promise<UserDto> {
        const options: FindOneOptions = {
            where: { id: userId }
        };

        return this.userRepository.findOne(options)
            .then(user => {
                if (user) {
                    if (user.addresses.map(e => e.id).includes(addressId)) {
                        return user;
                    }

                    return this.userRepository.update(userId, {
                        addresses: [...user.addresses, { id: addressId }]
                    })
                        .then(() => {
                            return this.userRepository.findOne(options)
                                .then((user) => {
                                    delete user.password;
                                    return user;
                                });
                        })
                        .catch((err) => {
                            throw new Error(err.message);
                        });
                }
            });
    }
}
