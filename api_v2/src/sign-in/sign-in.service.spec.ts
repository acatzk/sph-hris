import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from './sign-in.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';

describe('SignInService', () => {
  let service: SignInService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockPrismaService = {
    user: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
