import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { GoogleService } from './google.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly googleService: GoogleService) {
    super();
  }

  async serializeUser(user: any, done: Function) {
    console.log(user, 'serializeUser'); // 테스트 시 확인
    done(null, user);
  }
  async deserializeUser(payload: any, done: Function) {
    const user: any = await this.googleService.findUserById(payload.id);
    console.log(payload, 'deserializeUser'); // 테스트 시 확인
    return user ? done(null, user) : done(null, null);
  }
}
