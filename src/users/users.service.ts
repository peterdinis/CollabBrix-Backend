import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(registerData: RegisterDto) {
    const newUser = await this.prismaService.user.create({
      data: {
        ...registerData,
      },
    });

    if (!newUser) {
      throw new BadRequestException('Failed to create new user');
    }

    return newUser;
  }

  async findAllUsers(page: number = 1, pageSize: number = 10, search?: string) {
    const skip = (page - 1) * pageSize;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { username: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    };
  }

  async searchUsers(search: string) {
    if (!search || search.trim() === '') {
      throw new BadRequestException('Search query cannot be empty');
    }

    const users = await this.prismaService.user.findMany({
      where: {
        OR: [
          { email: { contains: search } },
          { username: { contains: search } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }
}
