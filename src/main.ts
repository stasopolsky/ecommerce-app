import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'your-secret-key', // Replace with your own secret
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
