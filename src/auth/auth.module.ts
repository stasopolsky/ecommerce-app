import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy'; // Import the JWT strategy
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_secret_key', // Ensure this matches the secret in your JwtStrategy
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    UserModule,
  ],
  providers: [AuthService, GoogleStrategy, FacebookStrategy, JwtStrategy], // Add JwtStrategy here
  controllers: [AuthController],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
