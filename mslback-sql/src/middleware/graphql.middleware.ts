import { InjectRedis } from "@nestjs-modules/ioredis";
import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "@service/jwt/auth.service";
import { Request, Response, NextFunction } from "express";
import { LoggerService } from "factory/logger.service";
import { CheckHeaders } from "interface/header";
import Redis from "ioredis";

@Injectable()
export class GraphqlHeaderMiddleware implements NestMiddleware {
    constructor(@InjectRedis() private readonly redis: Redis,
        private readonly loggerService: LoggerService,
        private readonly authService: AuthService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            let gqlContext = req.body.query;
            if (Object.keys(gqlContext).length !== 0) {
                gqlContext = this.extractSingleEqValue(gqlContext)
            } else {
                this.loggerService.Error('gqlContext is undefined');
                return res.status(400).send('Request context is missing');
            }

            if (!req) {
                this.loggerService.Error('Request is undefined');
                return res.status(400).send('Request object is missing');
            }

            const headers = req.headers;

            if (!headers) {
                this.loggerService.Error('headers is undefined');
                return res.status(400).send('Headers object is missing');
            }

            const checkedHeader = this.validateHeader(headers)

            if (checkedHeader) {
                // if (typeof checkedHeader == "string") {
                const isSignupRequest = gqlContext?.operationName === ('MobileSignUp' || 'WebSignUp'); // 회원가입에 해당하는 operationName resolver에 함수명                                                
                if (isSignupRequest) {
                    return next();
                } else {
                    // const mslCode = headers['mslcode'];

                    // if (!mslCode) {
                    //     throw new HttpException('mslCode header is missing', HttpStatus.FORBIDDEN);
                    // }


                    ////eq = gqlContext
                    // if (!gqlContext) {
                    //     throw new HttpException('eq parameter is missing', HttpStatus.BAD_REQUEST);
                    // }

                    // const { message } = await this.authService.checkHeader({ usingType: checkedHeader, eq: eq, headerToken: mslCode })

                    /* 여기는 제거 */
                    // const accessToken = await this.redis.get(`${checkedHeader} : ${gqlContext}`);

                    // if (!accessToken) {
                    //     throw new HttpException('Invalid accessToken', HttpStatus.FORBIDDEN);
                    // }

                    // const refreshToken = await this.redis.get(`${checkedHeader} : ${gqlContext} - ${accessToken}`);

                    // if (!refreshToken) {
                    //     throw new HttpException('Invalid refreshToken', HttpStatus.FORBIDDEN);
                    // }

                    // if (accessToken == mslCode)
                    //     next();
                    /* 여기 까지 */

                    // if (typeof message == "string")
                    //     return res.status(400).send(message);
                    // else if (typeof message == "boolean")
                    //     next();
                    next();
                }
            } else {
                return res.status(400).send('Invalid headers');
            }
        } catch (error) {
            this.loggerService.Error(error);
            return res.status(500).send('Internal server error');
        }
    }

    extractSingleEqValue(input: any): string | null {
        const regex = /eq:\s*"([^"]*)"/;
        const match = regex.exec(input);

        if (match) {
            return match[1];
        }

        return null;
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