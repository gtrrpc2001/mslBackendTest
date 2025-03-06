
import { InjectRedis } from "@nestjs-modules/ioredis";
import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "@service/jwt/auth.service";
import { Request, Response, NextFunction } from "express";
import { LoggerService } from "factory/logger.service";
import { CheckHeaders } from "interface/header";
import Redis from "ioredis";

@Injectable()
export class ALLHeaderMiddleware implements NestMiddleware {
    constructor(@InjectRedis() private readonly redis: Redis,
        private readonly loggerService: LoggerService,
        private readonly authService: AuthService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        console.log('ALLHeaderMiddleware invoked');
        try {
            if (!req) {
                this.loggerService.Error('Request is undefined');
                return res.status(400).send('Request object is missing');
            }

            const headers = req.headers;
            const checkedHeader = this.validateHeader(headers)

            if (checkedHeader) {
                // if (typeof checkedHeader == "string") {

                // const mslCode = headers['mslcode'];

                // if (!mslCode) {
                //     throw new HttpException('mslCode header is missing', HttpStatus.FORBIDDEN);
                // }

                // const method = req.method;
                // let eq;

                // if (method === 'GET') {
                //     eq = req.params.eq;
                // } else {
                //     eq = req.body.eq;
                // }

                // if (!eq) {
                //     throw new HttpException('eq parameter is missing', HttpStatus.BAD_REQUEST);
                // }

                // const { message } = await this.authService.checkHeader({ usingType: checkedHeader, eq: eq, headerToken: mslCode })

                /* 여기는 제거 */
                // const accessToken = await this.redis.get(`${checkedHeader} : ${eq}`);

                // if (!accessToken) {
                //     throw new HttpException('Invalid accessToken', HttpStatus.FORBIDDEN);
                // }

                // const refreshToken = await this.redis.get(`${checkedHeader} : ${eq} - ${accessToken}`);

                // if (!refreshToken) {
                //     throw new HttpException('Invalid refreshToken', HttpStatus.FORBIDDEN);
                // }

                // if (accessToken == mslCode)
                /* 여기 까지 */

                // if (typeof message == "string")
                //     return res.status(400).send(message);
                // else if (typeof message == "boolean")
                //     next();

                next();
            } else {
                return res.status(400).send('Invalid headers');
            }
        } catch (error) {
            this.loggerService.Error(error);
            return res.status(500).send('Internal server error');
        }
    }

    validateHeader(headers: any): boolean { //string | boolean
        const requiredHeaders = CheckHeaders();
        //string | boolean
        const allHeadersValid = Object.keys(requiredHeaders).every(header => {
            const headerValue = headers[header];
            const result = header in headers && typeof headerValue === 'string' && headerValue.startsWith(requiredHeaders[header]);

            if (!result) {
                return false;
            }

            // if (header === 'serviceType') {
            //   const include = requiredHeaders[header].includes(headers[header]);
            //   if (include) {
            //     return headers[header];
            //   }
            //   return include;
            // }
            return requiredHeaders[header] == headers[header]
        });

        this.loggerService.Info('All required headers valid:', allHeadersValid);
        return allHeadersValid;
    }
}