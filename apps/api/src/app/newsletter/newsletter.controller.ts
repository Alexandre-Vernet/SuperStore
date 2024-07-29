import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterDto, SendNewsletterDto } from "@superstore/interfaces";
import { AuthInterceptor } from "../auth/auth.interceptor";
import { AdminInterceptor } from "../auth/admin.interceptor";

@Controller('newsletter')
export class NewsletterController {
    constructor(
        private readonly newsletterService: NewsletterService,
    ) {
    }

    @Get('is-subscribed/:email')
    isUserSubscribed(@Param('email') email: string) {
        return this.newsletterService.isUserSubscribedToNewsletter(email);
    }

    @Post()
    subscribeUserToNewsletter(@Body() createNewsletterDto: NewsletterDto) {
        return this.newsletterService.subscribeUserToNewsletter(createNewsletterDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Post('send-email')
    sendNewsletter(@Body() newsletterDto: SendNewsletterDto) {
        return this.newsletterService.sendNewsletter(newsletterDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Get()
    findAll() {
        return this.newsletterService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.newsletterService.findOne(id);
    }

    @UseInterceptors(AuthInterceptor)
    @Put()
    updateSubscription(@Body() newsletterDto: NewsletterDto) {
        return this.newsletterService.updateSubscription(newsletterDto);
    }

    @UseInterceptors(AuthInterceptor)
    @UseInterceptors(AdminInterceptor)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.newsletterService.remove(id);
    }
}
