import {
  HttpStatus,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { smsEntity } from '../entity/sms.entity';
import dayjs from 'dayjs';
import moment from 'moment-timezone';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class SmsService {
  private accessKey = this.config.get('NAVER_ACCESSKEY');

  constructor(
    @InjectRepository(smsEntity) private smsRepository: Repository<smsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly config: ConfigService, // .env
  ) { }

  getUrl = () => {
    const naver_ID = this.config.get('NAVER_SERVICEID');
    return `/sms/v2/services/${naver_ID}/messages`;
  };

  // SMS 인증 위한 시그니쳐 생성 로직
  makeSignatureForSMS = (time: string): string => {
    const secretKey: string = this.config.get('NAVER_SECRETKEY');
    let message = [];
    const hmac = crypto.createHmac('sha256', secretKey);
    const timeStamp = time;
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const url = this.getUrl();
    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newLine);
    message.push(timeStamp);
    message.push(newLine);
    message.push(this.accessKey);
    //시그니처 생성
    const signature = hmac.update(message.join('')).digest('base64');
    //string 으로 반환
    return signature.toString();
  };

  checkDayCount = async (phoneNumber: string): Promise<boolean> => {
    try {
      let key: string = phoneNumber + 'smscount';

      const dayCount: number = await this.smsCount(phoneNumber);

      console.log('sms 인증 횟수 ' + dayCount);
      if (dayCount > 5) return false;

      return true;
    } catch (E) {
      console.log(E);
      return false;
    }
  };

  smsCount = async (phoneNumber: string): Promise<number> => {
    try {
      // .andWhere(`smsEntity.writetime like '%${timeDay}%'`)
      const timeDay = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
      const result = await this.smsRepository
        .createQueryBuilder()
        .select('COUNT(*) AS count')
        .where({ phone: phoneNumber })
        .andWhere({ writetime: Like(`%${timeDay}%`) })
        .getRawOne();
      let { count } = result;
      if (count == undefined) count = 0;
      return count;
    } catch (E) {
      console.log(E);
      return 0;
    }
  };

  messageLanguage = (checkNumber: string, nationalCode: number = 0) => {
    if (nationalCode === 82) {
      return `(주)엠에스엘에서 보낸 LOOKHEART 인증번호 [${checkNumber}] 입니다.`
    } else {
      return `This is a verification code [${checkNumber}] for your LOOKHEART account,sent by MSL Corporation.`
    }
  }

  sendSms = async (phoneNumber: string, nationalCode: number): Promise<any> => {
    // TODO : 1일 5회 문자인증 초과했는지 확인하는 로직 필요!
    const writetime = Date.now().toString();

    if (!(await this.checkDayCount(phoneNumber)))
      return '인증번호 하루 횟수 초과 하셨습니다.';

    const signature = this.makeSignatureForSMS(writetime);

    // 캐시에 있던 데이터 삭제
    await this.cacheManager.del(phoneNumber);

    // 난수 생성 (6자리로 고정)
    const checkNumber = this.makeOTP().toString().padStart(6, '0');

    const sendNumber: string = this.config.get('COMPANYNUMBER');

    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: `${nationalCode}`,
      from: sendNumber,
      content: this.messageLanguage(checkNumber, nationalCode),
      messages: [
        {
          to: phoneNumber,
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': writetime,
      'x-ncp-iam-access-key': this.accessKey,
      'x-ncp-apigw-signature-v2': signature,
    };

    const signatureUrl = this.getUrl();
    const url = `https://sens.apigw.ntruss.com${signatureUrl}`;
    try {
      const result = await axios
        .post(url, body, { headers })
        .then(async () => {
          await this.insertSMS(phoneNumber);
          // 캐시 추가하기
          await this.cacheManager.set(phoneNumber, checkNumber, 180000);
          return true;
        })
        .catch((error) => {
          console.log(HttpStatus.INTERNAL_SERVER_ERROR);
          console.log(error);
          return error;
        });
      return result;
    } catch (E) {
      console.log(E);
      return E;
    }
  };

  async sendInternationalSms(phoneNumber: string) {
    try {
      if (!(await this.checkDayCount(phoneNumber)))
        return '인증번호 하루 횟수 초과 하셨습니다.';

      // 캐시에 있던 데이터 삭제
      await this.cacheManager.del(phoneNumber);

      // 난수 생성 (6자리로 고정)
      const checkNumber = this.makeOTP().toString().padStart(6, '0');

      const sendNumber: string = this.config.get('COMPANYNUMBER');

      const body = this.messageLanguage(checkNumber)

      // const message = await this.client.messages.create({
      //   body: body,
      //   from: sendNumber,
      //   to: phoneNumber,
      // });

      // const result = message.sid === this.sid
      // console.log('message.sid : ',message.sid,'result : ', result)

      // if(result){        
      //   await this.insertSMS(phoneNumber);
      //   await this.cacheManager.set(phoneNumber, checkNumber, 180000);
      // }
      // console.log(`SMS sent to ${phoneNumber}`);
      // return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }

  //인증번호 발송 성공시 db 저장
  insertSMS = async (phoneNumber: string) => {
    try {
      const time = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
      const result = this.smsRepository
        .createQueryBuilder()
        .insert()
        .into(smsEntity)
        .values([{ phone: phoneNumber, writetime: time }])
        .execute();
    } catch (E) {
      console.log(E);
    }
  };

  // SMS 확인 로직, 문자인증은 3분 이내에 입력해야지 가능합니다!
  checkSMS = async (
    phoneNumber: string,
    inputNumber: number,
  ): Promise<boolean> => {
    try {
      const sentNumber = (await this.cacheManager.get(phoneNumber)) as number;
      console.log('check sms code' + typeof inputNumber);
      return sentNumber == inputNumber;
    } catch (E) {
      console.log(E);
      return false;
    }
  };

  // 무작위 6자리 랜덤 번호 생성하기
  makeOTP = (): number => {
    const randNum = Math.floor(Math.random() * 1000000);
    return randNum;
  };

  updateAppAlarmSendSms = async (phoneNumber: string): Promise<any> => {
    const writetime = Date.now().toString();

    const signature = this.makeSignatureForSMS(writetime);

    const sendNumber: string = this.config.get('COMPANYNUMBER');

    const googleUrl =
      'https://play.google.com/store/apps/details?id=com.msl.ble_for_ecg_new_ble';
    const appleUrl = 'https://apps.apple.com/us/app/lookheart/id6450522486';

    const content =
      `안녕하세요 LOOKHEART앱 사용자 여러분 (주)엠에스엘 에서 보낸 앱 업데이트 알림 입니다. \n` +
      `스토어 주소 안내 해 드리겠습니다. \n \n` +
      `\ 안드로이드 사용자 - ${googleUrl} ,,\n \  \n 애플 사용자 - ${appleUrl} \n \n이용해 주셔서 감사합니다.`;

    const body = {
      type: 'LMS',
      contentType: 'COMM',
      countryCode: `82`,
      from: sendNumber,
      content: content,
      messages: [
        {
          to: phoneNumber,
        },
      ],
    };

    console.log(body);

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': writetime,
      'x-ncp-iam-access-key': this.accessKey,
      'x-ncp-apigw-signature-v2': signature,
    };

    const signatureUrl = this.getUrl();
    const url = `https://sens.apigw.ntruss.com${signatureUrl}`;
    try {
      const result = await axios
        .post(url, body, { headers })
        .then(async () => {
          return true;
        })
        .catch((error) => {
          console.log(HttpStatus.INTERNAL_SERVER_ERROR);
          console.log(error);
          return error;
        });
      return result;
    } catch (E) {
      console.log(E);
      return E;
    }
  };
}
