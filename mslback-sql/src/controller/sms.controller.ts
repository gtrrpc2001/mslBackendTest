import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SmsService } from '../service/sms.service';
import { NationalCode } from 'interface/NaverNationalCodeList';
import { EmailService } from '@service/email.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('msl/mslSMS')
@ApiTags('SMS')
export class smsController {
  constructor(
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) { }
  @Get('/sendSMS')
  async getSendSMS(
    @Query('phone') phone: string,
    @Query('nationalCode') nationalCode: number,
  ) {
    if (NationalCode.find((n) => n === nationalCode)) {
      return await this.smsService.sendSms(phone, nationalCode);
    } else {
      const to = 'wlalsl4267@gmail.com';
      const token = this.emailService.createToken(to);
      return await this.emailService.sendEmail('wlalsl4267@gmail.com', token);
    }
  }

  @Get('/insertSMS')
  async getInsertSMS(
    @Query('phone') phone: string
  ) {
    return await this.smsService.insertSMS(phone);
  }

  @Get('/sendEmail')
  async getSendEmail() {
    const to = 'wlalsl4267@gmail.com';
    const token = this.emailService.createToken(to);
    return await this.emailService.sendEmail(to, token);
  }

  @Get('verify')
  async verifyEmail(
    @Query('token') token: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    const url = await this.emailService.TokenCheck(email, token);
    return res.redirect(url);
  }

  @Get('/checkSMS')
  async getCheckSMS(
    @Query('phone') phone: string,
    @Query('code') code: number,
  ): Promise<boolean> {
    return await this.smsService.checkSMS(phone, code);
  }

  @Get('emailSocketUrl')
  getEmailSocketUrl() {
    return { socketUrl: this.config.get<string>('EMAILSOCKET_URL') };
  }
  EMAILAPP_URL

  @Get('emailAppUrl')
  getEmailAppUrl() {
    return { appUrl: this.config.get<string>('EMAILAPP_URL') };
  }

  @Get('/countTest')
  async postTest(@Query('phone') phone: string): Promise<boolean> {
    return await this.smsService.checkDayCount(phone);
  }
}
