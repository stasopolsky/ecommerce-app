import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as passport from 'passport';
// import { AllExceptionsFilter } from './common/exceptions/exception.filter';
// import { AllExceptionsFilter } from './common/exceptions/exception.filter';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  //   const httpAdapter = app.get(HttpAdapterHost);
  //   app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.use(
    session({
      secret: 'your-secret-key', // Replace with your own secret
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  //   app.useGlobalPipes(new ValidationPipe());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
