import { Module } from '@nestjs/common';
import { MigrationService } from "./migration.service";
import { AddressModule } from "../address/address.module";
import { NewsletterModule } from "../newsletter/newsletter.module";
import { AuthModule } from "../auth/auth.module";
import { OrderModule } from "../order/order.module";
import { ProductModule } from "../product/product.module";
import { ReviewModule } from "../review/review.module";

@Module({
    imports: [
        AddressModule,
        AuthModule,
        NewsletterModule,
        OrderModule,
        ProductModule,
        ReviewModule
    ],
    providers: [MigrationService],
})
export class MigrationModule {
}
