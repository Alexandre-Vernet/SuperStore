import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { ProductEntity } from './product/product.entity';
import { OrderEntity } from './order/order.entity';
import { UserEntity } from './user/user.entity';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { AddressEntity } from './address/address.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { ReviewEntity } from './review/review.entity';
import { ReviewModule } from './review/review.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { NewsletterEntity } from './newsletter/newsletter.entity';
import { MigrationModule } from './migration/migration.module';
import { PromotionModule } from './promotion/promotion.module';
import { PromotionEntity } from './promotion/promotion.entity';
import { OrderProductEntity } from './order-product/order-product.entity';
import { ProductMiddleware } from './product/product.middleware';
import { UserMiddleware } from './user/user.middleware';
import { AddressMiddleware } from './address/address.middleware';
import { ImageEntity } from './image/image.entity';

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
    JWT_SECRET
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
            entities: [
                ProductEntity,
                OrderEntity,
                OrderProductEntity,
                UserEntity,
                AddressEntity,
                ReviewEntity,
                NewsletterEntity,
                PromotionEntity,
                ImageEntity
            ],
            ssl: false
        }),
        ProductModule,
        OrderModule,
        UserModule,
        AddressModule,
        EmailModule,
        AuthModule,
        ReviewModule,
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: '1d' }
        }),
        NewsletterModule,
        MigrationModule,
        PromotionModule
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ProductMiddleware)
            .forRoutes(
                { path: 'product/:id', method: RequestMethod.PUT },
                { path: 'product', method: RequestMethod.POST }
            );

        consumer.apply(UserMiddleware)
            .forRoutes({ path: 'user/:id', method: RequestMethod.PUT });

        consumer.apply(AddressMiddleware)
            .forRoutes({ path: 'address/:id', method: RequestMethod.PUT },
                { path: 'address', method: RequestMethod.POST }
            );
    }
}
