import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { faker } from '@faker-js/faker';
import { Newsletter } from "./newsletter.entity";
import { CreateNewsletterDto, NewsletterDto } from "@superstore/interfaces";
import { EmailService } from "../email/email.service";

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(Newsletter)
        private readonly newsletterRepository: Repository<Newsletter>,
        private readonly emailService: EmailService
    ) {
    }

    storeEmailInDatabase(createNewsletterDto: CreateNewsletterDto): Promise<CreateNewsletterDto> {
        createNewsletterDto.isSubscribed = true;
        return this.newsletterRepository.save(createNewsletterDto);
    }

    sendNewsletter(newsletter: NewsletterDto) {
        // Send newsletter to all subscribed users
        this.findAll()
            .then(newsletters => {
                newsletters.forEach(newsletters => {
                    if (newsletters.isSubscribed) {
                        newsletter.emails.push(newsletters.email);
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

    updateSubscription(newsletterDto: CreateNewsletterDto): Promise<CreateNewsletterDto> {
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

    migrate() {
        for (let i = 0; i < 45; i++) {
            const newsletter: CreateNewsletterDto = {
                email: faker.internet.email(),
                isSubscribed: faker.datatype.boolean(),
            };

            this.storeEmailInDatabase(newsletter);
        }
    }
}
