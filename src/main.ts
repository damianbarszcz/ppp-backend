import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://3.73.37.13:3000',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.setGlobalPrefix('api');
    app.useWebSocketAdapter(new IoAdapter(app));
    await app.listen(8000);

    const server = app.getHttpAdapter().getInstance();

    const availableRoutes = server._router.stack
        .filter((layer) => layer.route)
        .map(
            (layer) =>
                `${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${
                    layer.route.path
                }`,
        );

    Logger.log(`Server is running on: ${await app.getUrl()}`);
    Logger.log('WebSocket server is running');
    Logger.log(`Available Routes:\n${availableRoutes.join('\n')}`);
}
bootstrap();
