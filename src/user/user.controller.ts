import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Post('/login')
  login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return this.userService.login(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  async getProfile(@Request() req) {
    const userId = req.user._id;
    return this.userService.getUserProfile(userId);
  }
}
