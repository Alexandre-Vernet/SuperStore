import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { faker } from '@faker-js/faker';
import { Newsletter } from "./newsletter.entity";
import { CreateNewsletterDto, NewsletterDto } from "@superstore/interfaces";

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(Newsletter)
        private readonly newsletterRepository: Repository<Newsletter>,
    ) {
    }

    create(createNewsletterDto: CreateNewsletterDto): Promise<NewsletterDto> {
        return this.newsletterRepository.save(createNewsletterDto);
    }

    findAll() {
        // Order by id ASC
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        };

        return this.newsletterRepository.find(options);
    }

    findOne(id: number) {
        const options: FindOneOptions = {
            where: { id }
        };
        return this.newsletterRepository.findOne(options);
    }

    update(id: number, updateOrderDto: CreateNewsletterDto): Promise<NewsletterDto> {
        return this.newsletterRepository.update(id, updateOrderDto)
            .then(() => this.findOne(id));
    }

    remove(id: number) {
        return this.newsletterRepository.delete(id);
    }

    migrate() {
        for (let i = 0; i < 45; i++) {
            const newsletter: CreateNewsletterDto = {
                email: faker.internet.email(),
                isSubscribed: faker.datatype.boolean(),
            };

            this.create(newsletter);
        }
    }
}
