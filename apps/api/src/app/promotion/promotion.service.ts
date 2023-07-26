import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { Promotion } from "./promotion.entity";
import { faker } from "@faker-js/faker";

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(Promotion)
        private readonly promotionRepository: Repository<Promotion>,
    ) {
    }

    create(createPromotionDto: CreatePromotionDto) {
        return this.promotionRepository.save(createPromotionDto);
    }

    findAll() {
        return this.promotionRepository.find();
    }

    async findOne(label: string) {
        const options = {
            where: {
                label: label,
                count: MoreThan(0),
            }
        }
        const result = await this.promotionRepository.findOne(options);
        if (!result) {
            throw new NotFoundException(`Promotion with label ${ label } not found`)
        }
        return result;
    }

    update(id: number, updatePromotionDto: UpdatePromotionDto) {
        return this.promotionRepository.update(id, updatePromotionDto);
    }

    remove(id: number) {
        return this.promotionRepository.delete(id);
    }

    async migrate() {
        console.log('Migrating promotion...');

        await this.promotionRepository.query(`
        CREATE TABLE IF NOT EXISTS public.promotions (
            id SERIAL PRIMARY KEY,
            label TEXT NOT NULL,
            amount DECIMAL NOT NULL,
            count DECIMAL NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);

        for (let i = 0; i < 300; i++) {
            const promotion: CreatePromotionDto = {
                label: faker.commerce.productAdjective() + faker.datatype.number({ min: 1, max: 100 }),
                amount: faker.datatype.number({ min: 1, max: 50 }),
                count: faker.datatype.number({ min: 1, max: 20000 })
            }

            this.create(promotion);
        }
    }
}
