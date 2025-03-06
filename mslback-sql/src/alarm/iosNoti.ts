import { staticConfigValue } from '../config/staticConfigValue';
import { ConfigService } from '@nestjs/config';
import { firebasenoti } from './firebasenoti';
import * as admin from 'firebase-admin';
export class iosNoti {
  static ios: admin.ServiceAccount;

  static privateID = '';

  static setPath = (configService: ConfigService) => {
    this.ios = staticConfigValue.getFirebase_sdk_ios(configService);
    this.privateID = this.ios.projectId;
  };

  static async IOS(configService: ConfigService): Promise<boolean> {
    try {
      if (this.privateID == '') {
        this.setPath(configService);
        firebasenoti.initializeApp(this.ios, 'IOS');
      }
      return true;
    } catch (E) {
      console.log('여기서 빠짐');
      console.log(E);
      return false;
    }
  }
}
