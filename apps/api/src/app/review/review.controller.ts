import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from "@superstore/libs";
import { ReviewDto } from "@superstore/libs";

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {
    }

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

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateReviewDto: ReviewDto) {
        return this.reviewService.update(id, updateReviewDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.reviewService.remove(id);
    }
}
