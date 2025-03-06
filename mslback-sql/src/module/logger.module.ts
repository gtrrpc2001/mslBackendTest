import { Global, Module } from "@nestjs/common";
import { LoggerService } from "factory/logger.service";
import { LoggerModule } from "nestjs-pino";
import * as pino from 'pino';
import pretty from 'pino-pretty';
import * as multiStream from 'pino-multi-stream';

const streams = [
    { stream: pino.destination({ dest: './log/log.txt', sync: false }) },
    { stream: pretty({ colorize: true }) },
];

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level: 'info',
                stream: multiStream.multistream(streams),
            },
        })
    ],
})
export class CustomLoggerModule { }