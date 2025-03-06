import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../service/jwt/auth.service';
import { JwtStrategy } from '../service/jwt/jwtStrategy';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from 'factory/jwt.factory';
import { SessionStrategy } from '@service/session/session.strategy';
import { SessionMiddleware } from 'middleware/session.middleware';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
  ],
  exports: [JwtModule, AuthService],
  providers: [AuthService, JwtModule, JwtStrategy, SessionStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
