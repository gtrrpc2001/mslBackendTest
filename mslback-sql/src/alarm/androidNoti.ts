import { staticConfigValue } from '../config/staticConfigValue';
import { ConfigService } from '@nestjs/config';
import { firebasenoti } from './firebasenoti';
import * as admin from 'firebase-admin';

export class androidNoti {
  static android: admin.ServiceAccount;

  static privateID = '';

  static setPath = (configService: ConfigService) => {
    this.android = staticConfigValue.getFirebase_sdk(configService);
    this.privateID = this.android.projectId;
  };

  static async ANDROID(configService: ConfigService): Promise<boolean> {
    try {
      if (this.privateID == '') {
        this.setPath(configService);
        firebasenoti.initializeApp(this.android, 'ANDROID');
      }
      return true;
    } catch (E) {
      console.log('여기서 빠짐');
      console.log(E);
      return false;
    }
  }
}
