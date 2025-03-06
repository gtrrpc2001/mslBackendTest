import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SessionModule } from 'nestjs-session';
// import { SessionMiddleware } from 'middleware/SessionMiddleware';

@Module({
  imports: [
    SessionModule.forRoot({
      session: {
        secret: process.env.SESSION_SECRET, // 비밀 키
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000 }, // 1시간
      },
    }),
  ],
})
export class RedisSessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(SessionMiddleware).forRoutes('*'); // 모든 라우트에 적용
  }
}
