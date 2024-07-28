import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';
import { OrderProduct } from '../order-product/order-product.entity';
import { OrderProductModule } from '../order-product/order-product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderProduct]),
        AuthModule,
        AddressModule,
        UserModule,
        ProductModule,
        OrderProductModule,
        EmailModule,
        UserModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService]
})
export class OrderModule {
}
