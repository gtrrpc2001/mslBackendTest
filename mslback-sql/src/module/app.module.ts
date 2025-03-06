import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { allModule } from '../exportMVC/exportall';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PerformanceAndErrorLoggingInterceptor } from 'interceptor/performance.interceptor';
import helmet from 'helmet';

@Module({
  imports: allModule.appImport,
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceAndErrorLoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"]
          },
        },
        referrerPolicy: { policy: 'no-referrer' },
        frameguard: { action: 'deny' },
        xssFilter: true,
        noSniff: true,
        hsts: {
          maxAge: 31536000, // 1년
          includeSubDomains: true,
          preload: true,
        },
      }))
      .forRoutes('*');
  }
}
