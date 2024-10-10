import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDTO } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Body() registerUserDto: RegisterUserDTO) {
    return this.usersService.create(registerUserDto);
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() loginUserDto: LoginUserDTO) {
    return this.authService.login(loginUserDto);
  }
}
