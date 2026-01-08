import { Controller, Post, Body, Patch, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: Record<string, string>) {
    const result = await this.authService.login(body.email, body.passwordHash);
    if (!result) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return result;
  }

  @Post('register')
  async register(@Body() body: Record<string, any>) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizador')
  @Patch('profile')
  async updateProfile(
    @Request() req: any,
    @Body() updateData: Record<string, any>,
  ) {
    return this.usersService.update(req.user.id, updateData);
  }
}
