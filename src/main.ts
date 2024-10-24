import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Tabdil Hup')
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
    origin: 'http://localhost:3001', // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 204, // Success status for OPTIONS requests (preflight)
  };

  app.enableCors(corsOptions); // Enable CORS with specified options
  await app.listen(3090);
}
bootstrap();
