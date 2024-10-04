import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'; // Import User type from Prisma

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { email: string; password: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async savePasswordResetToken(email: string, token: string, expires: Date) {
    return this.prisma.user.update({
      where: { email: email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });
  }

  async findOneByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });
  }

  // Update user's password (replace with actual database logic)
  async updatePassword(userId: number, hashedPassword: string) {
    // Example logic, replace with actual DB update
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async makeAdmin(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    });
  }
  // Additional user methods can be added here (update, delete, etc.)
}
