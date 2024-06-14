import { Test, TestingModule } from '@nestjs/testing';
import { HrisApiService } from './hris-api.service';
import { AuthTokenService } from '@/auth-token/auth-token.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('HrisApiService', () => {
  let service: HrisApiService;

  const mockAuthTokenService = {
    getAuthToken: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HrisApiService,
        {
          provide: AuthTokenService,
          useValue: mockAuthTokenService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<HrisApiService>(HrisApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
