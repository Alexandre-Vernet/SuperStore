import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Review])],
    controllers: [ReviewController],
    providers: [ReviewService],
})

export class ReviewModule {
}
