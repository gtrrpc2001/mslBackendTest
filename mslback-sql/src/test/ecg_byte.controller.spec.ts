import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ecg_byteService } from '../service/ecg_byte.service';
import { ecg_byteController } from '../controller/ecg_byte.controller';
import { ecg_byteEntity } from '../entity/ecg_byte.entity';
import { ecg_raw_history_lastEntity } from '../entity/dataUpdateLast.entity';

describe('ecg_byteController', () => {
  let appController: ecg_byteController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ecg_byteController],
      providers: [
        ecg_byteService,
        {
          provide: getRepositoryToken(ecg_byteEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ecg_raw_history_lastEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<ecg_byteController>(ecg_byteController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('ecg_byteTest');
  });
});
