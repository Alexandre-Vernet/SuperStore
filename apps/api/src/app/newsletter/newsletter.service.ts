import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { NewsletterEntity } from './newsletter.entity';
import { NewsletterDto, SendNewsletterDto } from '@superstore/interfaces';
import { EmailService } from '../email/email.service';

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(NewsletterEntity)
        private readonly newsletterRepository: Repository<NewsletterEntity>,
        private readonly emailService: EmailService
    ) {
    }

    async subscribeUserToNewsletter(createNewsletterDto: NewsletterDto): Promise<NewsletterDto> {
        const options: FindOneOptions = {
            where: { email: createNewsletterDto.email }
        };
        const newsletter = await this.newsletterRepository.findOne(options);
        if (newsletter) {
            throw new ConflictException('This email is already subscribed to our newsletter.');
        }
        createNewsletterDto.isSubscribed = true;
        return this.newsletterRepository.save(createNewsletterDto);
    }

    async sendNewsletter(newsletter: SendNewsletterDto) {
        // Send newsletter to all subscribed users
        const newslettersSubscribed = await this.newsletterRepository.find({
            where: { isSubscribed: true }
        });

        newsletter.emails = newslettersSubscribed.map(n => n.email);
        return this.emailService.sendNewsletter(newsletter);
    }

    async isUserSubscribedToNewsletter(email: string) {
        const options: FindOneOptions = {
            where: { email }
        };
        const newsletter = await this.newsletterRepository.findOne(options);
        if (!newsletter) {
            return false;
        }
        return newsletter.isSubscribed;
    }

    async updateSubscription(newsletterToUpdate: NewsletterDto) {
        const options: FindOneOptions = {
            where: { email: newsletterToUpdate.email }
        };

        const newsletter = await this.newsletterRepository.findOne(options);
        newsletter.isSubscribed = newsletterToUpdate.isSubscribed;
        return this.newsletterRepository.update(newsletter.id, newsletter);
    }
}
