import { Injectable } from '@nestjs/common';
import { AddressService } from "../address/address.service";
import { AuthService } from "../auth/auth.service";
import { NewsletterService } from "../newsletter/newsletter.service";
import { OrderService } from "../order/order.service";
import { ProductService } from "../product/product.service";
import { ReviewService } from "../review/review.service";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { PromotionService } from "../promotion/promotion.service";

export const runMigration = async () => {
    const app = await NestFactory.create(AppModule, { cors: true });
    const addressService = app.get(AddressService);
    const authService = app.get(AuthService);
    const newsletterService = app.get(NewsletterService);
    const orderService = app.get(OrderService);
    const productService = app.get(ProductService);
    const reviewService = app.get(ReviewService);
    const promotionService = app.get(PromotionService);

    const migrationService = new MigrationService(
        addressService,
        authService,
        newsletterService,
        orderService,
        productService,
        reviewService,
        promotionService
    );

    await migrationService.migrateAllResources();
}


@Injectable()
export class MigrationService {

    constructor(
        private readonly addressService: AddressService,
        private readonly authService: AuthService,
        private readonly newsletterService: NewsletterService,
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly reviewService: ReviewService,
        private readonly promotionService: PromotionService
    ) {
    }

    async migrateAllResources() {
        // this.newsletterService.migrate();
        // this.promotionService.migrate();
        // this.productService.migrate();
        // this.addressService.migrate();
        // this.authService.migrate();
        // this.reviewService.migrate();
        // this.orderService.migrate();
    }
}
