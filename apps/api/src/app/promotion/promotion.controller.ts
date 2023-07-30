import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto, PromotionDto } from "@superstore/interfaces";
import { AuthInterceptor } from "../auth/auth.interceptor";

@Controller('promotion')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {
    }

    @UseInterceptors(AuthInterceptor)
    @Post()
    create(@Body() createPromotionDto: CreatePromotionDto) {
        return this.promotionService.create(createPromotionDto);
    }

    @Get()
    findAll() {
        return this.promotionService.findAll();
    }

    @Get(':label')
    findOne(@Param('label') label: string) {
        return this.promotionService.findOne(label);
    }

    @Put('use-promotion/:label')
    usePromotionCode(
        @Param('label') label: string,
        @Body() promotion: PromotionDto
    ) {
        return this.promotionService.usePromotionCode(label, promotion);
    }

    @UseInterceptors(AuthInterceptor)
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() promotion: PromotionDto
    ) {
        return this.promotionService.update(id, promotion);
    }

    @UseInterceptors(AuthInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.promotionService.remove(id);
    }
}
