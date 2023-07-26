import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

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

    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updatePromotionDto: UpdatePromotionDto
    ) {
        return this.promotionService.update(id, updatePromotionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.promotionService.remove(id);
    }
}
