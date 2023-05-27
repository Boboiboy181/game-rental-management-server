import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Configuration for Swagger
  const config = new DocumentBuilder()
    .setTitle('Video game management API')
    .setDescription('Video Game API description')
    .setVersion('1.0')
    .build();
  const docutment = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, docutment);

  // enable validation
  app.useGlobalPipes(new ValidationPipe());

  // define port number
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
