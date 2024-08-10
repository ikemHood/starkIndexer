import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './common/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  process
    .on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at Promise', { reason, p });
    })
    .on('uncaughtException', (err) => {
      console.log('Uncaught Exception thrown', { err });
    });

  await app.listen(process.env.PORT ?? env.app.port);
}

bootstrap();
