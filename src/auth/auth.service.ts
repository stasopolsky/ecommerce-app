import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Import your UserService
import { User } from '@prisma/client'; // Import User type from Prisma
import * as bcrypt from 'bcrypt'; // Make sure to install bcrypt
import { CreateUserDto } from './dto/create-user.dto';
// import * as crypto from 'crypto'; // For generating reset token
import * as nodemailer from 'nodemailer'; // For sending emails
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password?: string,
  ): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    // Add your password validation logic here (e.g., bcrypt)
    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = (await bcrypt.hash(password, 10)) as string;

    // Create and save the new user
    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    return {
      access_token: this.jwtService.sign(createUserDto),
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate a JWT token
    const token = this.jwtService.sign(
      { email: user.email }, // The payload contains the user's email
      {
        secret: 'your_secret_key', // Use a secret from the .env file
        expiresIn: '1h', // The token is valid for 1 hour
      },
    );

    // Generate a reset token
    // generateResetToken;
    // const resetToken = this.generateResetToken(email);
    // const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save the token and expiration in the database
    await this.userService.savePasswordResetToken(
      user.email,
      token,
      tokenExpires,
    );

    // Send the email with the reset token
    await this.sendPasswordResetEmail(email, token);

    return { message: 'Password reset email sent' };
  }

  private async sendPasswordResetEmail(email: string, resetToken: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'stas.opolsky@gmail.com',
        pass: 'egxt orvp rqsf heyr',
      },
    });

    const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: '"E-commerce App" <your-email@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click here to reset your password: ${resetUrl}`,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    console.log('Received token:', token);
    const payload = this.verifyToken(token);
    const user = await this.userService.getUserByEmail(payload.email); // Find user by email (replace with your logic)

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.updateUserPassword(user.id, hashedPassword); // Update the password
    return { message: 'Password reset successfully' };
  }
  signToken(email: string): string {
    return this.jwtService.sign({ email }); // Signing token
  }
  // Token Verification
  verifyToken(token: string): any {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'your_secret_key',
      });
      console.log(decoded);
      return decoded;
    } catch (err) {
      throw new BadRequestException('Invalid1 or expired token');
    }
  }

  // Update Password (with hashing)
  async updateUserPassword(userId: number, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);
    await this.userService.updatePassword(userId, hashedPassword); // Replace with your actual DB logic
  }

  // Example hashing function (using bcrypt)
  async hashPassword(password: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
