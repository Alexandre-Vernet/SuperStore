import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';
import { AuthModule } from '../auth/auth.module';
import { OrderProductModule } from '../order-product/order-product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        AuthModule,
        AddressModule,
        UserModule,
        OrderProductModule,
        EmailModule,
        UserModule,
        forwardRef(() => OrderProductModule),
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService]
})
export class OrderModule {
}
