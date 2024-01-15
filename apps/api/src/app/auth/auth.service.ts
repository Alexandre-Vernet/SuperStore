import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, SignInUserDto, UserDto } from "@superstore/interfaces";
import { FindOneOptions, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import bcrypt from "bcrypt";
import { faker } from '@faker-js/faker';
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private readonly emailService: EmailService
    ) {
    }

    async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string, user: UserDto }> {
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

        return this.userRepository.save(createUserDto)
            .then((user) => {
                const accessToken = this.jwtService.sign({ user });
                return this.signInWithAccessToken(accessToken);
            });
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


    updatePassword(userId: number, password: string) {
        const options: FindOneOptions = {
            where: {
                id: userId,
            }
        };

        return this.userRepository.findOne(options)
            .then(async user => {
                if (!user) {
                    throw new ConflictException('Invalid credentials');
                }

                // Hash security
                const hashedPassword = await bcrypt.hash(password, 10);
                if (!hashedPassword) {
                    throw new ConflictException('Something went wrong. Please try again later.');
                }
                return this.userRepository.update(userId, { password: hashedPassword });
            })
    }

    sendEmailForgotPassword(email: string) {
        const options: FindOneOptions = {
            where: {
                email,
            }
        };

        this.userRepository.findOne(options)
            .then(user => {
                if (user) {
                    // Generate URL with token
                    const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
                    const token = this.jwtService.sign({ user });
                    const linkResetPassword = `${ ALLOWED_ORIGIN }/reset-password?token=${ token }`;
                    return this.emailService.sendEmailResetPassword(user, linkResetPassword);
                }
            });
    }

    async migrate() {
        console.log('Migrating users...');

        await this.userRepository.query(`
            CREATE TABLE IF NOT EXISTS public.users (
                id SERIAL PRIMARY KEY,
                addresses_id INTEGER[],
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                is_admin BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        for (let i = 0; i < 100; i++) {
            const addressesId = [];
            const randomAddressId = Math.floor(Math.random() * 2) + 1;
            for (let j = 0; j < randomAddressId; j++) {
                addressesId.push(faker.datatype.number({ min: 1, max: 6 }));
            }

            const createUserDto: CreateUserDto = {
                addressesId,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                isAdmin: false
            };

            await this.signUp(createUserDto);
        }
    }
}
