import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { Promotion } from "./promotion.entity";
import { faker } from "@faker-js/faker";
import { PromotionDto } from "@superstore/interfaces";

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(Promotion)
        private readonly promotionRepository: Repository<Promotion>,
    ) {
    }

    async create(createPromotionDto: PromotionDto) {
        // Check if promotion code already exists
        const options = {
            where: {
                label: createPromotionDto.label,
            }
        };
        const result = await this.promotionRepository.findOne(options);
        if (result) {
            throw new NotFoundException(`Promotion with label ${ createPromotionDto.label } already exists`)
        }
        return this.promotionRepository.save(createPromotionDto);
    }

    findAll() {
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        }
        return this.promotionRepository.find(options)
    }

    async findBy(key: string, value: string) {
        const options = {
            where: {
                [key]: value,
                count: MoreThan(0),
            }
        }
        const result = await this.promotionRepository.findOne(options);
        if (!result) {
            throw new NotFoundException(`Promotion with label ${ label } not found`)
        }
        return result;
    }

    usePromotionCode(label: string, promotion: PromotionDto) {
        this.findBy('label', label)
            .then((result) => {
                promotion.count--;
                this.promotionRepository.update(result.id, promotion);
            });
    }

    async update(id: number, promotion: PromotionDto) {
        await this.promotionRepository.update(id, promotion);
        return this.findBy('label', promotion.label);
    }

    remove(id: number) {
        return this.promotionRepository.delete(id);
    }

    async migrate() {
        console.log('Migrating promotion...');

        for (let i = 0; i < 300; i++) {
            const promotion: PromotionDto = {
                label: faker.commerce.productAdjective() + faker.datatype.number({ min: 1, max: 100 }),
                amount: faker.datatype.number({ min: 1, max: 50 }),
                count: faker.datatype.number({ min: 1, max: 20000 })
            }

            this.create(promotion);
        }
    }
}
