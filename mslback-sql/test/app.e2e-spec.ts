import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/module/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/admin_login_log/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin_login_log/test')
      .expect(200)
      .expect('test');
  });

  afterAll(async () => {
    await app.close(); // 테스트 후 애플리케이션 종료
  });
});
