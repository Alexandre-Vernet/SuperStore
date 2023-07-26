import { Body, Controller, Delete, Get, Param, Post, Put, } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto, PromotionDto } from "@superstore/interfaces";

@Controller('promotion')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {
    }

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

    @Put(':label')
    usePromotionCode(
        @Param('label') label: string,
        @Body() promotion: PromotionDto
    ) {
        return this.promotionService.usePromotionCode(label, promotion);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.promotionService.remove(id);
    }
}
