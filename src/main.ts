import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips unknown properties
      forbidNonWhitelisted: true, // Throws an error if unknown properties are present
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Tabdil Hub')
    .setDescription(
      'The platform will allow users to exchange items by browsing categories, viewing item details, and making exchange requests',
    )
    .setVersion('1.0')
    .addTag('users') // Optional: Add tags for grouping
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Access docs at /api/docs

  // Define CORS options
  const corsOptions: CorsOptions = {
    origin: ['https://exchange100-admin.web.app', 'https://exchange100-d205e.web.app','http://localhost:3001'], // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 204, // Success status for OPTIONS requests (preflight)
  };
  
  app.enableCors(corsOptions); // Enable CORS with specified options
  await app.listen(3090);
}
bootstrap();
