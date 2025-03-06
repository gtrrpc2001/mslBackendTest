import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class MySqlMslConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('HOST'),
      port: +this.configService.get<number>('PORT'),
      username: this.configService.get<string>('NAME'),
      password: this.configService.get<string>('PASSWORD'),
      database: this.configService.get<string>('TDATABASE'),
      entities: ['dist/entity/*.entity.{js,ts}'],
      synchronize: false,
      //timezone:'Asia/Seoul',
      dateStrings: true,
    };
  }

  // createTypeOrmOptions(): TypeOrmModuleOptions {
  //   return {
  //     type: 'mysql',
  //     replication: {
  //       master: {
  //         host: '마스터_IP',
  //         port: 3306,
  //         username: '사용자',
  //         password: '비밀번호',
  //         database: '데이터베이스명',
  //       },
  //       slaves: [
  //         {
  //           host: '슬레이브_IP',
  //           port: 3307,
  //           username: '사용자',
  //           password: '비밀번호',
  //           database: '데이터베이스명',
  //         },
  //       ],
  //     },
  //     entities: ['dist/entity/*.entity.{js,ts}'],
  //     synchronize: false, // 개발 중에는 true로 설정하되, 배포 시에는 false로 변경
  //     dateStrings: true
  //   };
  // }
}
