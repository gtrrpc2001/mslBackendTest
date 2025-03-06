// import { Request,Response } from "@nestjs/common";
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AppleService } from '@service/apple/apple.service';

@Controller('msl/apple')
export class AppleController {
  constructor(
    private readonly appleService: AppleService) { }

  @Post('apple')
  async appleLogin(@Body() body: { token: string }) {
    try {
      const user = await this.appleService.verifyAppleToken(body.token);
      console.log('apple : ', user)

      // 여기서 사용자 정보를 데이터베이스에 저장하거나, JWT 토큰을 발급하는 등의 추가 작업을 수행할 수 있습니다.
      return user;
    } catch (error) {
      console.error('Error verifying Apple ID token:', error);
      throw new Error('Invalid token');
    }
  }

  @Get('appleUser')
  async appleUser(@Query('kid') kid: string) {
    const user = await this.appleService.getApplePublicKey(kid);
    return user
  }
}
