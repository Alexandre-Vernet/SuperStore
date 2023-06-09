import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
