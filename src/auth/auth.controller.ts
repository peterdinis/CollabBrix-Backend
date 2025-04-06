import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class AuthDto {
  email: string;
  password: string;
}

class AuthResponse {
  access_token: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponse })
  async register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 200, description: 'Successful login', type: AuthResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: AuthDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
