import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionStrategy extends PassportSerializer {
    constructor() {
        super();
    }

    serializeUser(user: any, done: Function) {
        done(null, user.id); // 사용자 ID를 세션에 저장
    }

    async deserializeUser(id: string, done: Function) {
        console.log(id)
        done(null, id); // 세션에 사용자 정보 저장
    }
}