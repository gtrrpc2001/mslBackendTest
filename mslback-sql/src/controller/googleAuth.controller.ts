// import { Request,Response } from "@nestjs/common";
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleService } from '@service/google/google.service';
import { GoogleAuthGuard } from '@service/google/googleAuthGuard';
import { ConfigService } from '@nestjs/config';

@Controller('msl/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly config: ConfigService
  ) { }

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = await this.googleService.validateUser(req.user);
    // 여기서 JWT 토큰을 발급하거나, 세션을 설정할 수 있습니다.      
    const userData = encodeURIComponent(JSON.stringify(user));
    const googleLoginUrl = this.config.get<string>('GOOGLELOGINURL')
    const redirectUrl = `${googleLoginUrl}?userData=${userData}`;
    return res.redirect(redirectUrl);
  }

  @Get('appUrl')
  async appUrl() {
    return { appUrl: this.config.get<string>('APPURL') }
  }
}
