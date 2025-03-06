import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ecg_byteController } from '../controller/ecg_byte.controller';
import { Ecg_byteEntity } from '../entity/ecg_byte.entity';
import { DataUpdateLastEntity } from '../entity/dataUpdateLast.entity';
import { Ecg_byteService } from '../service/ecg_byte.service';
import { GuardianGateway } from '@service/socket/GuardianGateway.service';
import { SendEcgService } from '@service/sendEcg.service';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcEcgService } from 'factory/grpc.factory';
import { SocketInterceptorModule } from './socket.interceptor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ecg_byteEntity, DataUpdateLastEntity]),
    ClientsModule.registerAsync([
      { name: 'ECG_PACKAGE', useClass: GrpcEcgService }
    ]),
    SocketInterceptorModule
  ],
  controllers: [Ecg_byteController],
  providers: [Ecg_byteService, GuardianGateway, SendEcgService],
  exports: [SendEcgService]
})
export class ecg_byteModule { }
