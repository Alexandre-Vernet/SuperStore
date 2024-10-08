import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PromotionEntity } from "./promotion.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([PromotionEntity]), AuthModule],
    controllers: [PromotionController],
    providers: [PromotionService],
    exports: [PromotionService]
})
export class PromotionModule {
}
