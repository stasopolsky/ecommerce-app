import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service'; // Adjust the path as necessary
import { User } from '@prisma/client'; // Adjust according to your user model

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_secret_key', // Make sure this matches the secret in JwtModule
    });
  }

  async validate(payload: { sub: any; email: string }): Promise<User> {
    // Here, you can return the user based on the payload
    return this.authService.validateUser(payload.email, payload.sub);
  }
}
