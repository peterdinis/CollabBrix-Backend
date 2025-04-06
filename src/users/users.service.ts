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
}
