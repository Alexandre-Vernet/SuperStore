import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { AuthMiddleware } from "./auth.middleware";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), EmailModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                {
                    path: 'user',
                    method: RequestMethod.POST
                },
                {
                    path: 'product',
                    method: RequestMethod.GET
                },
                {
                    path: 'product',
                    method: RequestMethod.POST
                },
                {
                    path: 'review',
                    method: RequestMethod.GET
                },
            )
            .forRoutes(
                {
                    path: 'order',
                    method: RequestMethod.ALL
                },
                {
                    path: 'address',
                    method: RequestMethod.ALL
                },
                {
                    path: 'product',
                    method: RequestMethod.ALL,
                },
                {
                    path: 'user',
                    method: RequestMethod.ALL
                },
                {
                    path: 'review',
                    method: RequestMethod.ALL
                },
            );
    }
}
