import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';
import { Order } from './order/order.entity';
import { User } from './user/user.entity';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { Address } from './address/address.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { Review } from './review/review.entity';
import { ReviewModule } from './review/review.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { Newsletter } from './newsletter/newsletter.entity';
import { MigrationModule } from './migration/migration.module';
import { PromotionModule } from './promotion/promotion.module';
import { Promotion } from './promotion/promotion.entity';
import { OrderProduct } from './order-product/order-product.entity';
import { ProductSize } from './product-size/product.size';
import { OrderProductModule } from './order-product/order-product.module';
import { ProductSizeModule } from './product-size/product-size.module';
import { ProductMiddleware } from './product/product.middleware';
import { UserMiddleware } from './user/user.middleware';
import { AddressMiddleware } from './address/address.middleware';

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
    JWT_SECRET,
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
            entities: [Product, Order, OrderProduct, ProductSize, User, Address, Review, Newsletter, Promotion],
            ssl: false,
        }),
        ProductModule,
        OrderModule,
        OrderProductModule,
        ProductSizeModule,
        UserModule,
        AddressModule,
        EmailModule,
        AuthModule,
        ReviewModule,
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        NewsletterModule,
        MigrationModule,
        PromotionModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProductMiddleware)
            .forRoutes(
                { path: 'product/:id', method: RequestMethod.PUT },
                { path: 'product', method: RequestMethod.POST },
            );

        consumer.apply(UserMiddleware)
            .forRoutes({ path: 'user/:id', method: RequestMethod.PUT });

        consumer.apply(AddressMiddleware)
            .forRoutes({ path: 'address/:id', method: RequestMethod.PUT },
                { path: 'address', method: RequestMethod.POST },
                );
    }
}
