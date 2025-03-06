import { parentsEntity } from '../entity/parents.entity';
import dayjs from 'dayjs'
import { CheckHeaders } from 'interface/header';
import * as crypto from 'crypto';
import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WebSocketPerformanceAndErrorLoggingInterceptor } from 'interceptor/performance.interceptor';

export class commonFun {
  static converterJson(result: any) {
    return JSON.stringify(result);
  }

  static async convertCsv(jsonFile: string) {
    const json_array = JSON.parse(jsonFile);
    let csv_string = '';
    const titles = Object.keys(json_array[0]);

    titles.forEach((title, index) => {
      csv_string += index != titles.length - 1 ? `${title}|` : `${title}\n`;
    });

    json_array.forEach((content, index) => {
      let row = '';

      for (let title in content) {
        row += row === '' ? `${content[title]}` : `|${content[title]}`;
      }

      csv_string += index !== json_array.length - 1 ? `${row}\r\n` : `${row}`;
    });

    return csv_string;
  }

  static getWritetime(): string {
    let today = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    return today;
  }

  static getTokens(parentsArr: parentsEntity[]): string[] {
    let tokens: string[] = [];
    let i = 0;
    for (const parents of parentsArr) {
      const token = parents.token;
      if (token != '' && token != null) {
        tokens[i] = parents.token;
        i += 1;
      }
    }
    return tokens;
  }

  static async getEcgNumArr(result: any[]): Promise<number[]> {
    const changeEcg: number[] = [];
    const ecgArr = result?.map((ecg: any) => {
      const ecgArr = ecg.ecgpacket;
      const after = ecgArr?.replaceAll(';', '');
      after?.split('][').forEach((data: string) => {
        const sliceEcg = data
          ?.replaceAll('[', '')
          ?.replaceAll(']', '')
          ?.split(',');
        sliceEcg.forEach((d) => {
          changeEcg.push(Number(d));
        });
      });
      return changeEcg;
    });
    return changeEcg;
  }

  static async getFromStringToNumberArrEcg(ecg: string): Promise<number[]> {
    const changeEcg: number[] = [];
    const after = ecg?.replaceAll(';', '');
    after?.split('][').forEach((data: string) => {
      const sliceEcg = data
        ?.replaceAll('[', '')
        ?.replaceAll(']', '')
        ?.split(',');
      sliceEcg.forEach((d) => {
        changeEcg.push(Number(d));
      });
    });
    return changeEcg;
  }

  static getStartLen(len: number): number {
    switch (len) {
      case 10:
        return 9;
      case 7:
        return 6;
      case 13:
        return 12;
    }
  }

  static getEcgBuffer(ecg: number[]): Buffer {
    const uint16Array = new Uint16Array(ecg);
    const arrBuffer = uint16Array.buffer;
    const buffer = Buffer.from(arrBuffer);
    return buffer;
  }

  static getEcgNumber(ecg: Buffer): number[] {
    const uint8Arr = new Uint8Array(ecg);
    const uint16Arr = new Uint16Array(uint8Arr.buffer);
    const newArr = [...uint16Arr];
    return newArr;
  }

  static validateHeader(headers: any): boolean { //string | boolean
    const requiredHeaders = CheckHeaders();
    //string | boolean
    const allHeadersValid = Object.keys(requiredHeaders).every(header => {
      const headerValue = headers[header];
      const result = header in headers && typeof headerValue === 'string' && headerValue.startsWith(requiredHeaders[header]);

      if (!result) {
        return false;
      }

      // if (header === 'serviceType') {
      //   const include = requiredHeaders[header].includes(headers[header]);
      //   if (include) {
      //     return headers[header];
      //   }
      //   return include;
      // }

      return requiredHeaders[header] == headers[header]
    });

    console.log('All required headers valid:', allHeadersValid);
    return allHeadersValid;
  }

  static generateSignature(): string {
    const secretkey = process.env.HEADER_SECRETKEY
    const message = process.env.HEADER_MESSAGE
    const hmac = crypto.createHmac('sha256', secretkey);
    hmac.update(message);
    return hmac.digest('base64');
  }

  static interceptorLogging(interceptor: WebSocketPerformanceAndErrorLoggingInterceptor, client: any) {
    const context = {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as ExecutionContext;
    const start = performance.now();
    interceptor.intercept(context, {
      handle: () => {
        return new Observable((observer) => {
          observer.next();
          observer.complete();
        });
      },
    }).subscribe({
      next: () => {
        const end = performance.now();
        console.log(`Client connected: ${client.id}`);
        console.log(`Connection handling took ${end - start}ms for client ${client.id}`);
      },
      error: (error) => {
        console.error(`Error during connection handling for client ${client.id}:`, error);
      },
    });
  }
}
