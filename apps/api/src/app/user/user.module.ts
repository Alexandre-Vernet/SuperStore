import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { EmailModule } from "../email/email.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule, AuthModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {
}
