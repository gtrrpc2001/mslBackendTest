import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmailService {
  private transporter;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly config: ConfigService,
  ) {
    // 이메일 전송 설정
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP 서버 주소
      port: Number(process.env.SMTP_PORT), // SMTP 포트
      secure: true, // true이면 465 포트, false이면 587 포트
      auth: {
        user: process.env.SMTP_USER, // 이메일 사용자명
        pass: process.env.SMTP_PASS, // 이메일 비밀번호
      },
      debug: true,      
    });
  }

  createToken(to: string) {
    const token = uuidv4(); // 임의의 토큰 생성
    this.redis.set(to, token, 'EX', 300);
    return token;
  }

  async verifyEmail(data: { token: string; roomId: string }) {
    const result = await this.redis.get(data.roomId);
    if (result === data.token) {
      await this.completeVerification(data.roomId);
      return { message: '이메일 인증이 완료되었습니다.', result: true };
    } else {
      return { message: '유효하지 않은 토큰입니다.', result: false };
    }
  }

  async completeVerification(to: string): Promise<void> {
    await this.redis.del(to); // 토큰 삭제
  }

  async TokenCheck(email: string, token: string) {
    const result = await this.redis.get(email);
    if (result === token) {
      const Email = encodeURIComponent(email);
      const Token = encodeURIComponent(token);
      return `${this.config.get<string>('EMAILURL')}?Email=${Email}&Token=${Token}`;
    }
    return this.config.get<string>('WEB_404URL');
  }

  // 이메일 전송 메서드
  async sendEmail(to: string, verificationToken: string) {
    const verificationLink = `${this.config.get<string>('CHECK_EMAIL')}?token=${verificationToken}&email=${to}`;

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>이메일 인증</title>
        </head>
        <body>
            <h1>이메일 인증</h1>
            <p>아래 버튼을 클릭하여 이메일 인증을 완료하세요.</p>
            <a id="verifyButton" href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">인증하기</a>
        </body>
        </html>
    `;
    const mailOptions = {
      from: process.env.SMTP_USER, // 보내는 사람 이메일
      to,
      subject: '이메일 인증',
      html: htmlContent,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
