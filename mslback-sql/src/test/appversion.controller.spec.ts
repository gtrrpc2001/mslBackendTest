import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { appversionService } from '../service/appversion.service';
import { appversionController } from '../controller/appversion.controller';
import { appversionEntity } from '../entity/appversion.entity';

describe('appversionController', () => {
  let appController: appversionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [appversionController],
      providers: [
        appversionService,
        {
          provide: getRepositoryToken(appversionEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<appversionController>(appversionController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('appversionTest');
  });
});
