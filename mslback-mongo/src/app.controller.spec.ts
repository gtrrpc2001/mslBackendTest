import { Test, TestingModule } from '@nestjs/testing';
import { EcgController } from './controller/ecg.controller';
import { EcgService } from './service/ecg.service';

describe('AppController', () => {
  let ecgController: EcgController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EcgController],
      providers: [EcgService],
    }).compile();

    ecgController = app.get<EcgController>(EcgController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ecgController.findOne('')).toBe('Hello World!');
    });
  });
});
