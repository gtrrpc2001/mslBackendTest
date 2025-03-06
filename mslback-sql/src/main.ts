import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { IncreasedBodyParser, OpenSwagger, setUpGlobalPipe } from 'init/init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setUpGlobalPipe(app);

  IncreasedBodyParser(app);

  OpenSwagger(app);

  //process.env.NGINX_PORT
  await app.listen(3000);

  // CheckFileChanged(app);
}
bootstrap();
