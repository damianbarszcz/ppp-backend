import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api')

  await app.listen(8000);

  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes = router.stack
      .filter((layer) => layer.route)
      .map((layer) => `${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);

  Logger.log(`🚀 Server is running on: ${await app.getUrl()}`);
  Logger.log(`Available Routes:\n${availableRoutes.join('\n')}`);
}

bootstrap();
