import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [PrismaModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
