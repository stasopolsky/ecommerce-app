/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Request,
  Response,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
// import { User } from '@prisma/client';
import { Request as Req1, Response as Res1 } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Protect this route with JWT guard
  getProfile(@Request() req) {
    return req.user; // Returns the authenticated user details
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('password-reset-request')
  async requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(requestPasswordResetDto.email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') newPassword: string,
  ) {
    // console.log('Received token:', token);
    return await this.authService.resetPassword(token, newPassword);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {
    // Initiates the Facebook OAuth process
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req) {
    return {
      message: 'User information from Facebook',
      user: req.user,
    };
  }

  @Get('logout')
  async logout(@Req() req: Req1, @Res() res: Res1) {
    // Invalidate the JWT or clear the user session
    req.logout((err) => {
      if (err) {
        return res.status(500).send('Logout failed');
      }
      res.redirect('/'); // Redirect to home or login page
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req) {
    // Initiates the Google authentication process
  }

  @Get('google/redirect') // Change this line
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    // Successful authentication, redirect or send response
    const user = req.user;
    // Here you can issue a JWT or set up a session, then redirect to a frontend route
    res.json({ message: 'Login successful', user });
  }
}
