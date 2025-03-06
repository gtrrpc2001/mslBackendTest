import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import session from 'express-session';
import Redis from "ioredis";
import passport from 'passport';
import RedisStore from "connect-redis";

@Injectable()
export class SessionMiddleware implements NestMiddleware {

    private sessionStore: any;
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) {
        this.sessionStore = new RedisStore({
            client: this.redis,
            ttl: 3600000,
        });
    }

    use(req: any, res: any, next: NextFunction) {
        // 세션 설정
        session({
            store: this.sessionStore,
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                sameSite: true,
                httpOnly: true,
                maxAge: 3600000,
                secure: false, // 개발 환경에서는 false로 설정
            },
        })(req, res, (err) => {
            if (err) {
                console.error('Session error:', err); // 에러 로그
                return next(err); // 에러가 발생하면 다음 미들웨어로 전달
            }

            // 세션이 설정된 후 세션 정보를 로그로 출력
            console.log('Session initialized:', req.session);

            passport.initialize()(req, res, (err) => {
                if (err) {
                    console.error('Passport initialization error:', err); // 에러 로그
                    return next(err);
                }

                passport.session()(req, res, (err) => {
                    if (err) {
                        console.error('Passport session error:', err); // 에러 로그
                        return next(err);
                    }
                    console.log('Passport session established:', req.sessionID); // 인증된 사용자 정보 출력
                    next();
                });
            });
        });
    }
}