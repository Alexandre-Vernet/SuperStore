import { Body, Controller, Delete, Get, Param, Post, } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto, NewsletterDto } from "@superstore/interfaces";

@Controller('newsletter')
export class NewsletterController {
    constructor(
        private readonly newsletterService: NewsletterService,
    ) {
    }

    @Post()
    storeEmailInDatabase(@Body() createNewsletterDto: CreateNewsletterDto) {
        return this.newsletterService.storeEmailInDatabase(createNewsletterDto);
    }

    @Post('send-email')
    sendNewsletter(@Body() newsletterDto: NewsletterDto) {
        return this.newsletterService.sendNewsletter(newsletterDto);
    }

    @Get()
    findAll() {
        return this.newsletterService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.newsletterService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.newsletterService.remove(id);
    }
}
