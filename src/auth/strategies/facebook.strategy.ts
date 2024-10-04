import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    console.log('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID);
    console.log('FACEBOOK_APP_SECRET:', process.env.FACEBOOK_APP_SECRET);
    console.log(
      'Facebook Client ID:',
      configService.get<string>('FACEBOOK_APP_ID'),
    );
    console.log(
      'Facebook Client Secret:',
      configService.get<string>('FACEBOOK_APP_SECRET'),
    );
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'), // Make sure this is defined
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'), // And this too
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    done(null, user);
  }
}
