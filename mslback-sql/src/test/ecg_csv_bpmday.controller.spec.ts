import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ecg_csv_bpmdayService } from '../service/bpmday.service';
import { ecg_csv_bpmdayController } from '../controller/bpmday.controller';
import { ecg_csv_bpmdayEntity } from '../entity/bpmday.entity';
import { ecg_raw_history_lastEntity } from '../entity/dataUpdateLast.entity';
import { ecg_csv_ecgdata_arrEntity } from '../entity/ecg_arr.entity';

describe('ecg_csv_bpmdayController', () => {
  let appController: ecg_csv_bpmdayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ecg_csv_bpmdayController],
      providers: [
        ecg_csv_bpmdayService,
        {
          provide: getRepositoryToken(ecg_csv_bpmdayEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ecg_raw_history_lastEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ecg_csv_ecgdata_arrEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<ecg_csv_bpmdayController>(ecg_csv_bpmdayController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('ecg_csv_bpmdayTest');
  });
});
