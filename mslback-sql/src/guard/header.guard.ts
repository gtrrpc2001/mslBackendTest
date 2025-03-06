import { InjectRedis } from "@nestjs-modules/ioredis";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { AuthService } from "@service/jwt/auth.service";
import { commonFun } from "clsfunc/commonfunc";
import { LoggerService } from "factory/logger.service";
import Redis from "ioredis";

@Injectable()
export class SocketHeadersGuard implements CanActivate {
    constructor(@InjectRedis() private readonly redis: Redis,
        private readonly loggerService: LoggerService,
        private readonly authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client = context.switchToWs().getClient();
            const headers = client.handshake.headers;
            const checkedHeader = commonFun.validateHeader(headers)
            // if (typeof checkedHeader == "string") {

            //     const mslCode = headers['mslcode'];

            //     if (!mslCode) {
            //         throw new WsException('mslCode header is missing');
            //     }
            //     const message = context.switchToWs().getData();
            //     const eq = message.eq;

            //     if (!eq) {
            //         throw new HttpException('eq parameter is missing', HttpStatus.BAD_REQUEST);
            //     }
            //     const { message } = await this.authService.checkHeader({ usingType: checkedHeader, eq: eq, headerToken: mslCode })

            /* 여기는 제거 */
            //     const accessToken = await this.redis.get(`${checkedHeader} : ${eq}`);

            //     if (!accessToken) {
            //         throw new HttpException('Invalid accessToken', HttpStatus.FORBIDDEN);
            //     }

            //     const refreshToken = await this.redis.get(`${checkedHeader} : ${eq} - ${accessToken}`);

            //     if (!refreshToken) {
            //         throw new HttpException('Invalid refreshToken', HttpStatus.FORBIDDEN);
            //     }

            //     return accessToken == mslCode;
            /* 여기 까지 */

            // if (typeof message == "string")
            //     return message;
            // else if (typeof message == "boolean")
            //     return message;
            // }

            // return false;
            return checkedHeader;
        } catch (error) {
            this.loggerService.Info(error)
            return false;
        }
    }
}