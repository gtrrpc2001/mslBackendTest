import { InjectRedis } from "@nestjs-modules/ioredis";
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import Redis from "ioredis";

@Injectable()
export class AbusingGuard implements CanActivate {
    constructor(
        @InjectRedis() private readonly redis: Redis,
        private readonly configService: ConfigService,
    ) {

    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        const request = ctx.req;
        const userIp = request.ip;
        if (userIp != this.configService.get('MYIP')) {
            const requestCount = await this.redis.incr(userIp);
            const lastRequestTime = await this.redis.get(`used:${userIp}`);
            const now = Date.now();
            const limit = Number(process.env.THROTTLE_LIMIT)
            const ttl = Number(process.env.THROTTLE_TTL)
            const blockIp = await this.redis.get(`blocked:${userIp}`)

            if (blockIp) {
                throw new HttpException("차단되었습니다. (You have been blocked.)", HttpStatus.FORBIDDEN);
            } else {
                if (lastRequestTime && (now - Number(lastRequestTime)) < ttl) {
                    if (requestCount > limit) {
                        const blockTime = Number(process.env.BLOCK_TIME);
                        const blockValue = process.env.BLOCK_VALUE;
                        await this.redis.set(`blocked:${userIp}`, blockValue, 'EX', blockTime);
                        throw new HttpException("차단되었습니다. (You have been blocked.)", HttpStatus.FORBIDDEN);
                    }
                } else {
                    const expire = Number(process.env.EXPIRE)
                    await this.redis.set(`used:${userIp}`, now);
                    await this.redis.expire(`used:${userIp}`, expire);
                }
            }
        }

        return true;
    }
}