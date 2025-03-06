import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ecg_raw_history_lastService } from '../service/dataUpdateLast.service';
import { ecg_raw_history_lastController } from '../controller/dataUpdateLast.controller';
import { ecg_csv_datadayEntity } from '../entity/dailydata.entity';
import { ecg_raw_history_lastEntity } from '../entity/dataUpdateLast.entity';

describe('ecg_raw_history_lastController', () => {
  let appController: ecg_raw_history_lastController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ecg_raw_history_lastController],
      providers: [
        ecg_raw_history_lastService,
        ConfigService,
        {
          provide: getRepositoryToken(ecg_raw_history_lastEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ecg_csv_datadayEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<ecg_raw_history_lastController>(
      ecg_raw_history_lastController,
    );
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('ecg_raw_history_lastTest');
  });
});
