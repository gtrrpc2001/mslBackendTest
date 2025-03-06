import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export class staticConfigValue {
  static getFirebase_sdk = (
    configService: ConfigService,
  ): admin.ServiceAccount => {
    return {
      projectId: configService.get<string>('ANDROIDID'),
      clientEmail: configService.get<string>('ANDROIDEMAIL'),
      privateKey: configService.get<string>('ANDROIDKEY').replace(/\\n/g, '\n'),
    };
  };

  static getFirebase_sdk_ios = (
    configService: ConfigService,
  ): admin.ServiceAccount => {
    return {
      projectId: configService.get<string>('IOSID'),
      clientEmail: configService.get<string>('IOSEMAIL'),
      privateKey: configService.get<string>('IOSKEY').replace(/\\n/g, '\n'),
    };
  };
}
