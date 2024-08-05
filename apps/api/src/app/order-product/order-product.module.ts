import { Module, forwardRef } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { OrderProductController } from './order-product.controller';
import { OrderProduct } from './order-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderProduct]),
        forwardRef(() => OrderModule),
    ],
    controllers: [OrderProductController],
    providers: [OrderProductService],
    exports: [OrderProductService]
})
export class OrderProductModule {
}
