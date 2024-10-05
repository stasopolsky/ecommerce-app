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
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
// import { User } from '@prisma/client';
import { Request as Req1, Response as Res1 } from 'express';
import { HttpExceptionFilter } from 'src/common/exceptions/exception.filter';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseFilters(new HttpExceptionFilter())
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
  async facebookAuthRedirect(@Req() req) {
    const token = await this.authService.login(req.user);
    return token;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req) {
    // Initiates the Google authentication process
  }

  @Get('google/redirect') // Change this line
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    const token = await this.authService.login(req.user);
    res.redirect('http://localhost:3000/auth/profile');
    // Successful authentication, redirect or send response
    // const user = req.user;
    // const token = this.login(req.user);
    // console.log(req.user);
    // const user = await this.authService.validateUser(req.user?.email);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    console.log(token);
    return token;
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
}
