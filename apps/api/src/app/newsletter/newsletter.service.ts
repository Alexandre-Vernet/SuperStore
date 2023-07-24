import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { faker } from '@faker-js/faker';
import { Newsletter } from "./newsletter.entity";
import { NewsletterDto, SendNewsletterDto } from "@superstore/interfaces";
import { EmailService } from "../email/email.service";

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(Newsletter)
        private readonly newsletterRepository: Repository<Newsletter>,
        private readonly emailService: EmailService
    ) {
    }

    storeEmailInDatabase(createNewsletterDto: NewsletterDto): Promise<NewsletterDto> {
        createNewsletterDto.isSubscribed = true;
        return this.newsletterRepository.save(createNewsletterDto);
    }

    sendNewsletter(newsletter: SendNewsletterDto) {
        // Send newsletter to all subscribed users
        this.findAll()
            .then(newsletters => {
                newsletters.forEach(n => {
                    if (n.isSubscribed) {
                        newsletter.emails.push(n.email);
                    }
                });
                return this.emailService.sendNewsletter(newsletter);
            });
    }

    findAll() {
        return this.newsletterRepository.find();
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.newsletterRepository.findOne(options);
    }

    remove(id: number) {
        return this.newsletterRepository.delete(id);
    }

    isUserSubscribed(email: string) {
        const options: FindOneOptions = {
            where: { email }
        };
        return this.newsletterRepository.findOne(options)
            .then(newsletter => {
                if (newsletter) {
                    return newsletter.isSubscribed;
                }
                return false;
            });
    }

    updateSubscription(newsletterDto: NewsletterDto): Promise<NewsletterDto> {
        const options: FindOneOptions = {
            where: { email: newsletterDto.email }
        };

        return this.newsletterRepository.findOne(options)
            .then((newsletter) => {
                return this.newsletterRepository.update(newsletter.id, { isSubscribed: !newsletter.isSubscribed })
                    .then(() => {
                        newsletter.isSubscribed = !newsletter.isSubscribed;
                        return newsletter;
                    });
            });
    }

    async migrate() {
        console.log('Migrating newsletter ...');
        await this.newsletterRepository.query(`
            CREATE TABLE IF NOT EXISTS public.newsletter (
                id SERIAL PRIMARY KEY,
                email TEXT NOT NULL,
                is_subscribed BOOLEAN DEFAULT FALSE NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            );
        `);

        for (let i = 0; i < 100; i++) {
            const newsletter: NewsletterDto = {
                email: faker.internet.email(),
                isSubscribed: faker.datatype.boolean(),
            };

            await this.storeEmailInDatabase(newsletter);
        }
    }
}
