import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as tls from 'tls';
import session from 'express-session';
import passport from 'passport';
import * as bodyParser from 'body-parser';
import { Redis } from 'ioredis';



export const setUpGlobalPipe = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
};

export const OpenSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('msl')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    // credentials: true,
  });
};

export const IncreasedBodyParser = (app: INestApplication) => {
  // 바디 파서의 크기 제한을 늘립니다.
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
};

export const CheckFileChanged = (app: INestApplication) => {
  const httpsServer = app.getHttpServer();

  // process.env.DOCKER_LETSENCRYPT_PATH
  fs.watch(process.env.LOCAL_LETSENCRYPT_PATH, (eventType, filename) => {
    if (filename) {
      console.log(`인증서 파일 변경 감지: ${filename}`);
      const httpsOptions = {
        // key: fs.readFileSync(process.env.DOCKER_KEY),
        // cert: fs.readFileSync(process.env.DOCKER_CERT),
        // ca: fs.readFileSync(process.env.DOCKER_CHAIN),
        key: fs.readFileSync(process.env.LOCAL_KEY),
        cert: fs.readFileSync(process.env.LOCAL_CERT),
        ca: fs.readFileSync(process.env.LOCAL_CHAIN),
        passphrase: process.env.PASSWORD,
      };
      const secureContext = tls.createSecureContext(httpsOptions);
      httpsServer.setSecureContext(secureContext);
      console.log('인증서 갱신됨');
    }
  });
};
