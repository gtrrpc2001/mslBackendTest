import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { app_bleService } from '../service/app_ble.service';
import { app_bleController } from '../controller/app_ble.controller';
import { app_bleEntity } from '../entity/app_ble.entity';
import { ConfigService } from '@nestjs/config';
import { parentsEntity } from '../entity/parents.entity';

describe('app_bleController', () => {
  let appController: app_bleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [app_bleController],
      providers: [
        app_bleService,
        ConfigService,
        {
          provide: getRepositoryToken(app_bleEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(parentsEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<app_bleController>(app_bleController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('app_bleTest');
  });
});
