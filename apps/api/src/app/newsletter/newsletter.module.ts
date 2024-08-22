import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { NewsletterEntity } from "./newsletter.entity";
import { EmailModule } from "../email/email.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([NewsletterEntity]), EmailModule, AuthModule],
    controllers: [NewsletterController],
    providers: [NewsletterService],
    exports: [NewsletterService]
})
export class NewsletterModule {
}
