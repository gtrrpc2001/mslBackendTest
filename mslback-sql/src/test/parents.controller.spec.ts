import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { parentsService } from '../service/parents.service';
import { parentsController } from '../controller/parents.controller';
import { parentsEntity } from '../entity/parents.entity';

describe('parentsController', () => {
  let appController: parentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [parentsController],
      providers: [
        parentsService,
        {
          provide: getRepositoryToken(parentsEntity),
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<parentsController>(parentsController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be defined', () => {
    expect(appController.Test()).toBe('parentsTest');
  });
});
