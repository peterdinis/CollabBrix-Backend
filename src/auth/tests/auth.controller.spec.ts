import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { ExecutionContext } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { JwtAuthGuard } from '../guards/auth.guard';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = {
            userId: faker.string.uuid(),
            email: faker.internet.email(),
          };
          return true;
        },
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register()', () => {
    it('should register a new user', async () => {
      const dto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
      };

      const expectedResponse = { id: faker.string.uuid(), ...dto };
      mockUsersService.create.mockResolvedValue(expectedResponse);

      const result = await authController.register(dto);
      expect(result).toEqual(expectedResponse);
      expect(usersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('login()', () => {
    it('should validate user and return access token', async () => {
      const dto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const fakeUser = { id: faker.string.uuid(), email: dto.email };
      const token = { access_token: faker.string.uuid() };

      mockAuthService.validateUser.mockResolvedValue(fakeUser);
      mockAuthService.login.mockResolvedValue(token);

      const result = await authController.login(dto);

      expect(authService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(authService.login).toHaveBeenCalledWith(fakeUser);
      expect(result).toEqual(token);
    });
  });

  describe('profile()', () => {
    it('should return the authenticated user', async () => {
      const fakeReq = {
        user: {
          userId: faker.string.uuid(),
          email: faker.internet.email(),
        },
      };

      const result = await authController.profile(fakeReq as any);
      expect(result).toEqual({
        userId: fakeReq.user.userId,
        email: fakeReq.user.email,
      });
    });
  });
});
