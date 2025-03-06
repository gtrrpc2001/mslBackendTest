import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { app_logService } from '../service/app_log.service';
import { app_logController } from '../controller/app_log.controller';
import { app_logEntity } from '../entity/app_log.entity';

describe('app_logController', () => {
  let appController: app_logController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [app_logController],
      providers: [
        app_logService,
        {
          provide: getRepositoryToken(app_logEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<app_logController>(app_logController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('app_logTest');
  });
});
