import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ecg_ArrController } from '../controller/ecg_arr.controller';
import { Ecg_byteEntity } from '../entity/ecg_byte.entity';
import { Ecg_ArrEntity } from '../entity/ecg_arr.entity';
import { parentsEntity } from '../entity/parents.entity';
import { UserEntity } from '../entity/user.entity';
import { Ecg_ArrService } from '../service/ecg_arr.service';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcArrService } from 'factory/grpc.factory';
import { SendArrService } from '@service/sendArr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ecg_ArrEntity,
      parentsEntity,
      UserEntity,
      Ecg_byteEntity,
    ]),
    ClientsModule.registerAsync([
      { name: 'ARR_PACKAGE', useClass: GrpcArrService }
    ]),
  ],
  controllers: [Ecg_ArrController],
  providers: [Ecg_ArrService, SendArrService],
})
export class Ecg_ArrModule { }
