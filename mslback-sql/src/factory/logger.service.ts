import { Injectable } from "@nestjs/common";
import { Logger } from "nestjs-pino";

@Injectable()
export class LoggerService {
    constructor(private readonly logger: Logger) { }

    Info(message: any, ...optionalParams: any[]) {
        this.logger.log(message, optionalParams); // 일반 정보 로그
    }

    Debug(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, optionalParams); // 디버깅 정보 로그
    }

    Warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, optionalParams); // 경고 로그
    }

    Error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, optionalParams); // 오류 로그
    }

    Fatal(message: any, ...optionalParams: any[]) {
        this.logger.fatal(message, optionalParams); // 치명적인 오류 로그
    }

    Verbose(message: any, ...optionalParams: any[]) {
        this.logger.verbose(message, optionalParams); // 상세 정보 로그
    }
}

