import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/user.entity";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule  {
}
