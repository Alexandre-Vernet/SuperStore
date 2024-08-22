import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressEntity } from "./address.entity";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity]), UserModule, AuthModule],
  controllers: [AddressController],
  providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}
