import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto, NewsletterDto } from "@superstore/interfaces";

@Controller('newsletter')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) {
    }

    @Post()
    create(@Body() createNewsletterDto: CreateNewsletterDto) {
        return this.newsletterService.create(createNewsletterDto);
    }

    @Get()
    findAll() {
        return this.newsletterService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.newsletterService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateNewsletterDto: NewsletterDto
    ) {
        return this.newsletterService.update(id, updateNewsletterDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.newsletterService.remove(id);
    }
}
