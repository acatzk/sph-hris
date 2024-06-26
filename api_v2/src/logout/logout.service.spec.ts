import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { LogoutService } from './logout.service';
import { LogoutRequestInput } from '@/graphql/graphql';

describe('LogoutService', () => {
  let service: LogoutService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutService,
        {
          provide: PrismaService,
          useValue: {
            personalAccessToken: {
              findFirst: jest.fn().mockResolvedValue(null),
              delete: jest.fn().mockResolvedValue(null),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LogoutService>(LogoutService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return "Successfully logged out" when token exists', async () => {
    const logoutRequest: LogoutRequestInput = { token: 'valid_token' };
    const tokenExists = {
      id: 1,
      token: 'valid_token',
      userId: 1,
      expiration: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(prismaService.personalAccessToken, 'findFirst')
      .mockResolvedValue(tokenExists);
    jest
      .spyOn(prismaService.personalAccessToken, 'delete')
      .mockResolvedValue(tokenExists);

    const result = await service.logout(logoutRequest);
    expect(result).toBe('Successfully logged out');
  });

  it('should return "Token not found" when token does not exist', async () => {
    const logoutRequest: LogoutRequestInput = { token: 'invalid_token' };

    jest
      .spyOn(prismaService.personalAccessToken, 'findFirst')
      .mockResolvedValue(null);

    const result = await service.logout(logoutRequest);
    expect(result).toBe('Token not found');
  });
});
