import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.enableCors({
        origin: process.env.ALLOWED_ORIGIN,
    });

    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT;
    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${ port }/${ globalPrefix }`
    );
}

bootstrap();