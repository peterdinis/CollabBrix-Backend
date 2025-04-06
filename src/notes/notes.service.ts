import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseISO, isWithinInterval } from 'date-fns';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllNotes() {
    const allNotes = await this.prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!allNotes) {
      throw new NotFoundException('No notes found');
    }

    return allNotes;
  }

  async getOneNote(noteId: number) {
    const oneNote = await this.prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!oneNote) {
      throw new NotFoundException('Note not found');
    }

    return oneNote;
  }

  async getAllUsersNotes(userId: number) {
    const allMyNotes = await this.prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!allMyNotes) {
      throw new NotFoundException('User does not create any notes');
    }

    return allMyNotes;
  }

  async getUserNoteDetail(noteId: number, userId: number) {

    const oneUserNote = await this.prisma.note.findFirst({
        where: {
            id: noteId,
            userId
        }
    })

    if(!oneUserNote) {
        throw new NotFoundException("This note does not exits")
    }

    return oneUserNote
  }

  async createNewNote(userId: number, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async updateNote(noteId: number, userId: number, dto: UpdateNoteDto) {
    const note = await this.getUserNoteDetail(noteId, userId);

    return this.prisma.note.update({
      where: { id: note.id },
      data: dto,
    });
  }

  async deleteNote(noteId: number, userId: number) {
    const note = await this.getUserNoteDetail(noteId, userId);

    return this.prisma.note.delete({
      where: { id: note.id },
    });
  }

  async deleteAllUserNotes(userId: number) {
    return this.prisma.note.deleteMany({
      where: { userId },
    });
  }

  async sortingMyUserNotes(
    userId: number,
    sortBy: 'title' | 'createdAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: {
        [sortBy]: order,
      },
    });
  }

  async sortUserNotesByDateRange(userId: number, from: string, to: string) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);

    const allNotes = await this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return allNotes.filter((note) =>
      isWithinInterval(note.createdAt, { start: fromDate, end: toDate }),
    );
  }
}
