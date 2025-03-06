import { Injectable,UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { promisify } from 'util';

@Injectable()
export class AppleService {
  private client = jwksRsa({
    jwksUri: 'https://appleid.apple.com/auth/keys',
  });

  private getSigningKey = promisify(this.client.getSigningKey);

  async getApplePublicKey(kid: string): Promise<string> {
    const key = await this.getSigningKey(kid);
    return key.getPublicKey();
  }

  async verifyAppleToken(idToken: string): Promise<any> {
    const decodedToken: any = jwt.decode(idToken, { complete: true });

    if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
    }

    const kid = decodedToken.header.kid;
    const key = await this.getSigningKey(kid);
    const publicKey = key.getPublicKey();
    try{
        const payload = jwt.verify(idToken, publicKey, {
            algorithms: ['RS256'],
          });
        return payload;
    }catch(error){
        throw new UnauthorizedException('Token verification failed');
    }
    
  }
}