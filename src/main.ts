import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: ['http://localhost:5432'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Portofolio endpoints')
    .setDescription('Personal API description')
    .setVersion('1.0.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs/api', app, documentFactory, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
