import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get a Hello World message' })
  @ApiResponse({ status: 200, description: 'Returns Hello World string.' })
  getHello(): string {
    return this.appService.getHello();
  }
}