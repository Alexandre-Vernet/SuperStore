/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    const NODE_ENV = process.env.NODE_ENV || 'development';
    if (NODE_ENV === 'production') {
        app.enableCors({
            origin: 'https://superstore-hxlq.onrender.com',
        })
    } else {
        app.enableCors({
            origin: 'http://localhost:4200',
        })
    }

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${ port }/${ globalPrefix }`
    );
}

bootstrap();
