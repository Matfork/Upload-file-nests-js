import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { redisClient } from './redis.store';
import * as csurf from 'csurf';

const RedisStore = connectRedis(session as any);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(
    session({
      name: 'session_user',
      secret: 'session_password',
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        prefix: 'rid:',
      }),
      cookie: {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure: false, // only https
        maxAge: 1000 * 60 * 60 * 24, // 7 days
      },
    } as any),
  );
  app.enableCors();

  await app.listen(4000);
}
bootstrap();
