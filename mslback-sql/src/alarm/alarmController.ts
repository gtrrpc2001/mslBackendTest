import { isDefined } from 'class-validator';
import { parentsEntity } from '../entity/parents.entity';
import { Repository } from 'typeorm';
import { firebasenoti } from './firebasenoti';
import { commonFun } from '../clsfunc/commonfunc';
import { ConfigService } from '@nestjs/config';

export class alarmController {
  static getBody(address: string, time: string, timezone: string): string {
    switch (true) {
      case timezone?.includes('US'):
        return `${isDefined(address) ? 'User Location:' + address : ''} time: ${this.getTime(time)}`;
      case timezone?.includes('CN'):
        return `${isDefined(address) ? '使用者位置:' + address : ''} 时间: ${this.getTime(time)}`;
      case timezone?.includes('BR'):
        return `${isDefined(address) ? 'Endereço do Dispositivo:' + address : ''} Hora: ${this.getTime(time)}`;
      default:
        return `${isDefined(address) ? '발생주소:' + address : ''} 시간: ${this.getTime(time)}`;
    }
  }

  static getBleTitle(timezone: string): string {
    switch (true) {
      case timezone?.includes('US'):
        return `bluetooth of user`;
      case timezone?.includes('CN'):
        return `用户蓝牙`;
      case timezone?.includes('BR'):
        return `Bluetooth do Usuário`;
      default:
        return `사용자 블루투스`;
    }
  }

  static getBleBody(activity: string, time: string, timezone: string): string {
    const check = this.getBleActivityCheck(activity);
    switch (true) {
      case timezone?.includes('US'):
        return `${time} - ${activity}`;
      case timezone?.includes('CN'):
        return `${time} - ${check ? '连接' : '断开'}`;
      case timezone?.includes('BR'):
        return `${time} - ${check ? 'Conectar' : '断开'}`;
      default:
        return `${time} - ${check ? '연결' : 'Desconectar'}`;
    }
  }

  static getBleActivityCheck(activity: string): boolean {
    return !activity.includes('Dis');
  }

  static getTitle(
    arrStatus: string,
    bodystate: number,
    timezone: string,
  ): string {
    switch (true) {
      case timezone?.includes('US'):
        return `${bodystate == 1 ? 'Emergency!!' : ` ${this.getENGStatus(arrStatus)}`} detected!`;
      case timezone?.includes('CN'):
        return `${bodystate == 1 ? '紧急状况!!' : ` ${this.getChStatus(arrStatus)}`}`;
      case timezone?.includes('BR'):
        return `${bodystate == 1 ? 'Emergência!!' : ` ${this.getBrStatus(arrStatus)}`}`;
      default:
        return `${bodystate == 1 ? '긴급!! 응급상황' : this.getStatus(arrStatus)} 발생!`;
    }
  }

  static getStatus(arrStatus: string): string {
    switch (arrStatus) {
      case 'slow':
        return '서맥';
      case 'fast':
        return '빈맥';
      case 'irregular':
        return '부정맥';
      default:
        return '부정맥';
    }
  }

  static getENGStatus(arrStatus: string): string {
    switch (arrStatus) {
      case 'irregular':
        return 'Arrhythmia';
      case 'arr':
        return 'Arrhythmia';
      case 'slow':
        return 'Bradycardia';
      case 'fast':
        return 'Tachycardia';
    }
  }

  static getChStatus(arrStatus: string): string {
    switch (arrStatus) {
      case 'irregular':
        return '心律失常!';
      case 'arr':
        return '心律失常!';
      case 'slow':
        return ' 心动过缓!';
      case 'fast':
        return '心动过速!';
    }
  }

  static getBrStatus(arrStatus: string): string {
    switch (arrStatus) {
      case 'irregular':
        return 'Arritmia!';
      case 'arr':
        return 'Arritmia!';
      case 'slow':
        return ' Bradicardia!';
      case 'fast':
        return 'Taquicardia!';
    }
  }

  static getTime(time: string): string {
    let resultTime = this.splitTime(time);
    console.log(`여기테스트---${resultTime}`);
    return resultTime;
  }

  static splitTime(time: string): string {
    let resultTime: string[];
    switch (time.length) {
      case 19:
        resultTime = time.split(' ');
        return resultTime[1];
      default:
        let afterTimes = time.split('T');
        resultTime = afterTimes[1].split('.');
        return resultTime[0];
    }
  }

  static async getSelToken(
    tokenRepository: Repository<parentsEntity>,
    eq: string,
  ): Promise<parentsEntity[]> {
    try {
      const result = await tokenRepository
        .createQueryBuilder('parents')
        .select('token')
        .where({ eq: eq })
        .getRawMany();
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  static async callPushAlarm(
    parentsArr: parentsEntity[],
    body: any,
    configService: ConfigService,
    ble: boolean = false,
  ): Promise<boolean> {
    try {
      if (parentsArr.length != 0) {
        let tokens: string[] = commonFun.getTokens(parentsArr);
        let i = 0;
        if (tokens.length != 0)
          return await firebasenoti.PushNoti(tokens, body, configService, ble);
        else return false;
      }
    } catch {
      return false;
    }
  }
}
