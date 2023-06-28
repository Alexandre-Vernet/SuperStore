import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Newsletter } from "./newsletter.entity";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [TypeOrmModule.forFeature([Newsletter]), EmailModule],
    controllers: [NewsletterController],
    providers: [NewsletterService],
    exports: [NewsletterService]
})
export class NewsletterModule {
}
