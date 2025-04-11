import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes (admin only)' })
  getAllNotes() {
    return this.notesService.getAllNotes();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all notes of a user' })
  @ApiParam({ name: 'userId', type: Number })
  getUserNotes(@Param('userId', ParseIntPipe) userId: number) {
    return this.notesService.getAllUsersNotes(userId);
  }

  @Get('user/:userId/note/:id')
  @ApiOperation({ summary: 'Get a specific note of a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  getUserNoteDetail(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notesService.getUserNoteDetail(id, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', type: Number })
  getNote(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.getOneNote(id);
  }

  @Post('user/:userId')
  @ApiOperation({ summary: 'Create a new note for a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiBody({ type: CreateNoteDto })
  createNote(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.createNewNote(userId, dto);
  }

  @Patch('user/:userId/note/:id')
  @ApiOperation({ summary: "Update a user's note" })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateNoteDto })
  updateNote(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.updateNote(id, userId, dto);
  }

  @Delete('user/:userId/note/:id')
  @ApiOperation({ summary: "Delete a user's note" })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  deleteNote(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notesService.deleteNote(id, userId);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Delete all notes of a user' })
  @ApiParam({ name: 'userId', type: Number })
  deleteAllUserNotes(@Param('userId', ParseIntPipe) userId: number) {
    return this.notesService.deleteAllUserNotes(userId);
  }

  @Get('user/:userId/sort')
  @ApiOperation({ summary: "Sort user's notes by field and order" })
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'sortBy', enum: ['title', 'createdAt'], required: false })
  @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
  sortUserNotes(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('sortBy') sortBy: 'title' | 'createdAt' = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.notesService.sortingMyUserNotes(userId, sortBy, order);
  }

  @Get('user/:userId/sort/date-range')
  @ApiOperation({ summary: "Filter user's notes by createdAt date range" })
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'from', type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'to', type: String, example: '2024-12-31' })
  sortByDateRange(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.notesService.sortUserNotesByDateRange(userId, from, to);
  }

  // New Endpoint: Pagination for logged-in user
  @Get('user/:userId/paginated')
  @ApiOperation({ summary: 'Get paginated notes for a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', type: Number, required: false, example: 10 })
  getPaginatedNotes(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.notesService.getPaginatedNotesForLoggedInUser(userId, page, pageSize);
  }

  // New Endpoint: Search notes for logged-in user
  @Get('user/:userId/search')
  @ApiOperation({ summary: 'Search notes for a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'search', type: String, required: true, example: 'meeting' })
  searchNotes(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('search') search: string,
  ) {
    return this.notesService.searchNotesForLoggedInUser(String(userId),Number(search));
  }
}
