import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() body: { email: string; password: string },
  ): Promise<User> {
    return this.userService.createUser(body.email, body.password);
  }

  // Additional endpoints can be added here (e.g., get, update, delete)
}
