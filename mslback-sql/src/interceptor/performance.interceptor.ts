import { CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor } from "@nestjs/common";
import { LoggerService } from "factory/logger.service";
import { Observable, catchError, tap } from "rxjs";

@Injectable()
export class PerformanceAndErrorLoggingInterceptor implements NestInterceptor {
    constructor(private loggerService: LoggerService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.getArgByIndex(2);
        const start = performance.now();

        return next.handle().pipe(
            tap(() => {
                const end = performance.now();
                const duration = end - start;
                const operationName = request.body?.operationName || 'Unnamed operation';
                this.loggerService.Info(`Request (${operationName}) took ${duration}ms`);
            }),
            catchError((error) => {
                const operationName = request.body?.operationName || 'Unnamed operation';
                this.loggerService.Error(`Error occurred during GraphQL request (${operationName}):`, error);
                throw new InternalServerErrorException('An error occurred while processing your request.');
            }),
        );
    }
}

@Injectable()
export class WebSocketPerformanceAndErrorLoggingInterceptor implements NestInterceptor {
    constructor(private loggerService: LoggerService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const wsContext = context.switchToWs();
        const client = wsContext.getClient();
        const start = performance.now();

        return next.handle().pipe(
            tap(() => {
                const end = performance.now();
                const duration = end - start;
                this.loggerService.Info(`WebSocket Request from ${client.id} took ${duration}ms`);
            }),
            catchError((error) => {
                this.loggerService.Error(`Error occurred during WebSocket request from ${client.id}:`, error);
                throw new InternalServerErrorException('An error occurred while processing your request.');
            }),
        );
    }
}