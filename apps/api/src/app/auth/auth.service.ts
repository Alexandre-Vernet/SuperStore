import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from "@superstore/interfaces";
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

    async signUp(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new ConflictException('This email is already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        if (!hashedPassword) {
            throw new ConflictException('Something went wrong. Please try again later.');
        }
        createUserDto.password = hashedPassword;
        createUserDto.isAdmin = false;

        return this.userRepository.save(createUserDto);
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
                    throw new ConflictException('Email or password is incorrect');
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
