import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { parseISO, isWithinInterval } from "date-fns";

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllNotes() {
    return this.prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getOneNote(noteId: number) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException("Note not found");
    return note;
  }

  async getAllUsersNotes(userId: number) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getUserNoteDetail(noteId: number, userId: number) {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) throw new NotFoundException("Note not found for this user");
    return note;
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

  async sortingMyUserNotes(userId: number, sortBy: "title" | "createdAt" = "createdAt", order: "asc" | "desc" = "desc") {
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
      orderBy: { createdAt: "desc" },
    });

    return allNotes.filter(note =>
      isWithinInterval(note.createdAt, { start: fromDate, end: toDate })
    );
  }
}