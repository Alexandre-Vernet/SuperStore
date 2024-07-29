import { Body, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterDto, SendNewsletterDto } from '@superstore/interfaces';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AdminInterceptor } from '../auth/admin.interceptor';

@Controller('newsletter')
export class NewsletterController {
    constructor(
        private readonly newsletterService: NewsletterService,
    ) {
    }

    @UseInterceptors(AdminInterceptor)
    @Get('is-subscribed/:email')
    isUserSubscribed(@Param('email') email: string) {
        return this.newsletterService.isUserSubscribedToNewsletter(email);
    }

    @Post()
    subscribeUserToNewsletter(@Body() createNewsletterDto: NewsletterDto) {
        return this.newsletterService.subscribeUserToNewsletter(createNewsletterDto);
    }

    @UseInterceptors(AdminInterceptor)
    @Post('send-email')
    sendNewsletter(@Body() newsletterDto: SendNewsletterDto) {
        return this.newsletterService.sendNewsletter(newsletterDto);
    }

    @UseInterceptors(AuthInterceptor)
    @Put()
    updateSubscription(@Body() newsletterDto: NewsletterDto) {
        return this.newsletterService.updateSubscription(newsletterDto);
    }
}
