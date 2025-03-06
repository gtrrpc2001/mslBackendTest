import { Test, TestingModule } from '@nestjs/testing';
import { admin_login_logService } from '../service/admin_login_log.service';
import { admin_login_logEntity } from '../entity/admin_login_log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { admin_login_logController } from '../controller/admin_login_log.controller';

describe('admin_login_logController', () => {
  let appController: admin_login_logController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [admin_login_logController],
      providers: [
        admin_login_logService,
        {
          provide: getRepositoryToken(admin_login_logEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<admin_login_logController>(
      admin_login_logController,
    );
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('admin_login_logTest');
  });
});
