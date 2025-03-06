import { isDefined } from 'class-validator';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { alarmController } from './alarmController';
import { iosNoti } from './iosNoti';
import { androidNoti } from './androidNoti';

export class firebasenoti {
  static initializeApp = (kind: admin.ServiceAccount, name: string) => {
    if (admin.apps.length < 2) {
      admin.initializeApp(
        {
          credential: admin.credential.cert(kind),
        },
        name,
      );
    }
  };

  static async PushNoti(
    tokens: string[],
    body: any,
    configService: ConfigService,
    ble: boolean,
  ): Promise<boolean> {
    try {
      const names = ['IOS', 'ANDROID'];
      for (var name of names) {
        await this.setKindBrand(name, configService);
        if (!ble)
          await this.setPushAlarm(
            name,
            tokens,
            body.arrStatus,
            body.writetime,
            body.address,
            body.bodystate,
            body.timezone,
          );
        else
          await this.setBlePushAlarm(
            name,
            tokens,
            body.writetime,
            body.activity,
            body.timezone,
          );
      }
      return true;
    } catch (E) {
      console.log(E);
      console.log('alarm error');
      return false;
    }
  }

  static setKindBrand = async (name: string, configService: ConfigService) => {
    switch (name) {
      case 'ANDROID':
        await androidNoti.ANDROID(configService);
        break;
      default:
        await iosNoti.IOS(configService);
        break;
    }
  };

  static async setPushAlarm(
    name: string,
    tokens: string[],
    arrStatus: string,
    time: string,
    address: string,
    bodystate: number,
    timezone: string,
  ): Promise<boolean> {
    try {
      let title = alarmController.getTitle(arrStatus, bodystate, timezone);
      let body = alarmController.getBody(address, time, timezone);
      console.log('성공 ' + title);
      await admin
        .app(name)
        .messaging()
        .sendEachForMulticast({
          notification: { title, body },
          tokens: tokens,
          android: { priority: 'high' },
          apns: {
            payload: {
              aps: {
                sound:
                  bodystate == 1 ? 'heartAttackSound.wav' : 'basicsound.wav',
              },
            },
          },
        })
        .catch((error: any) => {
          console.error(error);
          console.error('Error Details:', error.errorInfo);
          return false;
        });
      return true;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  static async setBlePushAlarm(
    name: string,
    tokens: string[],
    time: string,
    activity: string,
    timezone: string,
  ): Promise<boolean> {
    try {
      let title = alarmController.getBleTitle(timezone);
      let body = alarmController.getBleBody(activity, time, timezone);
      console.log('성공 ' + title);
      await admin
        .app(name)
        .messaging()
        .sendEachForMulticast({
          notification: { title, body },
          tokens: tokens,
          android: { priority: 'high' },
          apns: {
            payload: {
              aps: {
                sound: 'basicsound.wav',
              },
            },
          },
        })
        .catch((error: any) => {
          console.error(error);
          return false;
        });
      return true;
    } catch (E) {
      console.log(E);
      return false;
    }
  }
}
