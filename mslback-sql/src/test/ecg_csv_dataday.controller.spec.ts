import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ecg_csv_datadayService } from '../service/dailydata.service';
import { ecg_csv_datadayController } from '../controller/dailydata.controller';
import { ecg_csv_datadayEntity } from '../entity/dailydata.entity';

describe('ecg_csv_datadayController', () => {
  let appController: ecg_csv_datadayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ecg_csv_datadayController],
      providers: [
        ecg_csv_datadayService,
        {
          provide: getRepositoryToken(ecg_csv_datadayEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<ecg_csv_datadayController>(
      ecg_csv_datadayController,
    );
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('ecg_csv_datadayTest');
  });
});
