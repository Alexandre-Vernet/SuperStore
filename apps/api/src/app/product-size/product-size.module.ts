import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSize } from './product.size';

@Module({
    imports: [TypeOrmModule.forFeature([ProductSize])],
})
export class ProductSizeModule {
}
