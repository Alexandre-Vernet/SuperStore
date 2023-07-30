import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Review]), AuthModule],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService]
})

export class ReviewModule {
}
