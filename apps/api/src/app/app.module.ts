import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "./product/product.module";
import { Product } from "./product/product.entity";
import { Order } from "./order/order.entity";
import { Cart } from "./cart/cart.entity";
import { User } from "./user/user.entity";
import { OrderModule } from "./order/order.module";
import { CartModule } from "./cart/cart.module";
import { UserModule } from "./user/user.module";

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE
} = process.env;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: POSTGRES_HOST,
            port: Number(POSTGRES_PORT),
            username: POSTGRES_USERNAME,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DATABASE,
            entities: [Product, Order, Cart, User],
            ssl: true,
        }),
        ProductModule,
        OrderModule,
        CartModule,
        UserModule
    ],
})
export class AppModule {
}
