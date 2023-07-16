import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), EmailModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {
}
