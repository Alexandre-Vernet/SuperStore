import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        EmailModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {
}
