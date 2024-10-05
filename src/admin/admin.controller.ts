import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator'; // The Roles decorator we implemented earlier
import { RolesGuard } from '../auth/guards/roles.guard'; // The Roles guard we implemented
import { Role, User } from '@prisma/client'; // Import the Role enum
import { HttpExceptionFilter } from 'src/common/exceptions/exception.filter';
import { AuthGuard } from '@nestjs/passport';
// import { Role } from '../auth/enums/role.enum';

@Controller('admin')
// @UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard('jwt'), RolesGuard) // Use the RolesGuard to protect admin routes
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(Role.ADMIN) // Only users with the 'ADMIN' role can access this route
  async getAllUsers() {
    // console.log('This is a log message');
    return this.adminService.getAllUsers(); // This calls the service to fetch all users
  }

  @Post(':id/role')
  @Roles(Role.ADMIN) // Use the Role enum, not a string
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: Role,
  ): Promise<User> {
    return this.adminService.updateUserRole(Number(id), role);
  }

  @Delete('users/:id')
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.adminService.deleteUser(Number(id));
  }
}
