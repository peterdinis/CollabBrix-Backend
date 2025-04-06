import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterDto } from 'src/users/dto/register-dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { LoginDto } from './dto/login-dto';

class AuthResponse {
  access_token: string;
}

class UserProfileResponse {
  userId: string;
  email: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponse,
  })
  async register(@Body() body: RegisterDto) {
    return this.usersService.create(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: Partial<LoginDto>) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user data',
    type: UserProfileResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async profile(@Request() req) {
    return {
      userId: req.user.userId,
      email: req.user.email,
    };
  }
}
