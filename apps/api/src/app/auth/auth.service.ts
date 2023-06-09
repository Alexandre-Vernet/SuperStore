import { ConflictException, Injectable } from '@nestjs/common';
import { SignInUserDto } from "@superstore/libs";
import { FindOneOptions, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) {
    }

    signIn(signInUserDto: SignInUserDto) {
        const options: FindOneOptions = {
            where: {
                email: signInUserDto.email,
            }
        };
        return this.userRepository.findOne(options)
            .then(async (user) => {
                if (!user) {
                    throw new ConflictException('Invalid credentials');
                }
                const matchPassword = await bcrypt.compare(signInUserDto.password, user.password);
                if (!matchPassword) {
                    throw new ConflictException('Invalid password');
                }

                delete user.password;
                return {
                    accessToken: await this.jwtService.signAsync({ user }),
                    user
                }
            });
    }

    signInWithAccessToken(accessToken: string) {
        return this.jwtService.verifyAsync(accessToken)
            .then(async (decoded) => {
                const user = await this.userRepository.findOne({
                    where: {
                        id: decoded.user.id
                    }
                });
                if (!user) {
                    throw new ConflictException('Invalid credentials');
                }
                delete user.password;
                return {
                    accessToken: await this.jwtService.signAsync({ user }),
                    user
                }
            })
            .catch(() => {
                throw new ConflictException('Your session has expired. Please sign in again.');
            });
    }
}
