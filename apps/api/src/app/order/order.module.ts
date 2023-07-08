import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { EmailModule } from "../email/email.module";
import { UserModule } from "../user/user.module";
import { AddressModule } from "../address/address.module";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        AddressModule,
        UserModule,
        ProductModule,
        EmailModule,
        UserModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService]
})
export class OrderModule {
}
