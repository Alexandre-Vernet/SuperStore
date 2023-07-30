import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete, UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto, CreateReviewDto } from "@superstore/interfaces";
import { AuthInterceptor } from "../auth/auth.interceptor";

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

    @UseInterceptors(AuthInterceptor)
    @Post()
    create(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.create(createReviewDto);
    }

    @Get('/product/')
    findReviewsForAllProducts() {
        return this.reviewService.findReviewsForAllProducts();
    }

    @Get('/product/:productId')
    findReviewsForProduct(@Param('productId') productId: number) {
        return this.reviewService.findReviewsForProduct(productId);
    }

    @UseInterceptors(AuthInterceptor)
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateReviewDto: ReviewDto) {
        return this.reviewService.update(id, updateReviewDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.reviewService.remove(id);
    }
}
