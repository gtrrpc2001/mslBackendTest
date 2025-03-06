import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { UserController } from '../resolver/user.resolver';
import { DeleteUserLogEntity, UserEntity } from '../entity/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  delete_user_last_logEntity,
  ecg_raw_history_lastEntity,
} from '../entity/dataUpdateLast.entity';
import { parentsEntity } from '../entity/parents.entity';

describe('userController', () => {
  let appController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ecg_raw_history_lastEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(parentsEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(DeleteUserLogEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(delete_user_last_logEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('userTest');
  });
});
