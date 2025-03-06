import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLECLIENTID'),
      clientSecret: config.get<string>('GOOGLESECRETKEY'),
      callbackURL: config.get<string>('GOOGLECALLBACKURL'),
      scope: ['email', 'profile'],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, provider } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      socialProvider: provider,
      externalId: profile.id,
      accessToken,
      refreshToken,
    };
    try {
      console.log(user,"strategy");
      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }
}
