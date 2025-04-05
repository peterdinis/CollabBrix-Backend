import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppResendModule } from 'src/resend/resend.module';

@Module({
  imports: [PrismaModule, AppResendModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
