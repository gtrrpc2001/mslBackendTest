import { Module } from "@nestjs/common";
import { WebSocketPerformanceAndErrorLoggingInterceptor } from "interceptor/performance.interceptor";

@Module({
    providers: [
        WebSocketPerformanceAndErrorLoggingInterceptor
    ],
    exports: [WebSocketPerformanceAndErrorLoggingInterceptor]
})
export class SocketInterceptorModule { }