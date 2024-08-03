import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {

  // used for reading from .env files
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // validates that the payload sent over HTTPS adheres to the DTO class definitions
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  
  await app.listen(8888);
  console.log("Application is running on: http://localhost:8888");
}
bootstrap();
