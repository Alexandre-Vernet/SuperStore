import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ImageEntity } from '../image/image.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity, ImageEntity]),
        AuthModule
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule {
}
