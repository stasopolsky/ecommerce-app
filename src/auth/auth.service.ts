import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Import your UserService
import { User } from '@prisma/client'; // Import User type from Prisma
import * as bcrypt from 'bcrypt'; // Make sure to install bcrypt
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);
    // Add your password validation logic here (e.g., bcrypt)
    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
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

    // console.log(user);
    // You can choose to automatically log them in or just return a success message
    // return { message: 'User registered successfully' };
    return { user };
  }
}
