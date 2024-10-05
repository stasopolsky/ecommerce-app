import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Ensure PrismaService is available
import { Role, User } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    try {
      console.log('This is a log message');
      return this.prisma.user.findMany(); // Fetch all users from the database
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserRole(userId: number, role: Role): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  // Delete a user
  async deleteUser(userId: number): Promise<User> {
    console.log('This is a log message');
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
