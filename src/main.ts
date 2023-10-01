import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging.interceptor';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { createLogger, format, transports } from 'winston';

async function bootstrap() {
  const formatW =
    process.env.NODE_ENV === 'production'
      ? format.json()
      : nestWinstonModuleUtilities.format.nestLike();

  const instance = createLogger({
    transports: [
      new transports.Console({
        format: format.combine(format.timestamp(), formatW),
      }),
    ],
  });
  const logger = WinstonModule.createLogger({
    instance,
  });
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.listen(3000);
}
bootstrap();
