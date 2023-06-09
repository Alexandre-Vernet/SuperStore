import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { AuthMiddleware } from "./auth.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService],
    controllers: [AuthController],
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
            );
    }
}
