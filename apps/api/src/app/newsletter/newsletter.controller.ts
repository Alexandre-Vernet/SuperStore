import { Body, Controller, Delete, Get, Param, Post, Put, } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterDto, SendNewsletterDto } from "@superstore/interfaces";

@Controller('newsletter')
export class NewsletterController {
    constructor(
        private readonly newsletterService: NewsletterService,
    ) {
    }

    @Get('is-subscribed/:email')
    isUserSubscribed(@Param('email') email: string) {
        return this.newsletterService.isUserSubscribed(email);
    }

    @Post()
    storeEmailInDatabase(@Body() createNewsletterDto: NewsletterDto) {
        return this.newsletterService.storeEmailInDatabase(createNewsletterDto);
    }

    @Post('send-email')
    sendNewsletter(@Body() newsletterDto: SendNewsletterDto) {
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

    @Put()
    updateSubscription(@Body() newsletterDto: NewsletterDto) {
        return this.newsletterService.updateSubscription(newsletterDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.newsletterService.remove(id);
    }
}
