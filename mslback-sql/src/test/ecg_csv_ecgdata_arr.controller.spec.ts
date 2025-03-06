import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ecg_csv_ecgdata_arrService } from '../service/ecg_arr.service';
import { ecg_csv_ecgdata_arrController } from '../controller/ecg_arr.controller';
import { ecg_byteEntity } from '../entity/ecg_byte.entity';
import { ecg_csv_ecgdata_arrEntity } from '../entity/ecg_arr.entity';
import { parentsEntity } from '../entity/parents.entity';
import { UserEntity } from '../entity/user.entity';

describe('ecg_csv_ecgdata_arrController', () => {
  let appController: ecg_csv_ecgdata_arrController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ecg_csv_ecgdata_arrController],
      providers: [
        ecg_csv_ecgdata_arrService,
        ConfigService,
        {
          provide: getRepositoryToken(ecg_csv_ecgdata_arrEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(parentsEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ecg_byteEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<ecg_csv_ecgdata_arrController>(
      ecg_csv_ecgdata_arrController,
    );
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('ecg_csv_ecgdata_arrTest');
  });
});
