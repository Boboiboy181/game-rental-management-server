import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://game-rental-management-client.vercel.app',
      'https://game-rental-management-client-dashboard.vercel.app',
      'https://react-ant--elegant-croquembouche-112f48.netlify.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Configuration for Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
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
