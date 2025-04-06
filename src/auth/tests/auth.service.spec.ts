import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const password = faker.internet.password();
      const email = faker.internet.email();
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        id: faker.string.uuid(),
        email,
        password: hashedPassword,
        name: faker.person.fullName(),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(email, password);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        authService.validateUser(faker.internet.email(), faker.internet.password()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = faker.internet.email();
      const user = {
        id: faker.string.uuid(),
        email,
        password: faker.internet.password(),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.validateUser(email, 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a signed JWT token', async () => {
      const user = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
      };

      const fakeToken = faker.string.uuid();

      mockJwtService.sign.mockReturnValue(fakeToken);

      const result = await authService.login(user);

      expect(result).toEqual({ access_token: fakeToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
    });
  });
});
