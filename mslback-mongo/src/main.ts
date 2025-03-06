import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  const config = new DocumentBuilder()
  .setTitle('msl')
  .setDescription('API description')
  .setVersion('1.0')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,document);
  app.enableCors({    
    origin:'*',
    methods:['POST', 'PUT', 'DELETE', 'GET'],
    credentials:true
  }); 
  
  await app.listen(process.env.PORT_TEST);  
}
bootstrap();
