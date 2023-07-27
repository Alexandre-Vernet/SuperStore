import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Promotion } from "./promotion.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Promotion])],
    controllers: [PromotionController],
    providers: [PromotionService],
    exports: [PromotionService]
})
export class PromotionModule {
}
