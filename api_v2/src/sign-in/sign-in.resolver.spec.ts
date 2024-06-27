import { Test, TestingModule } from '@nestjs/testing';
import { SignInResolver } from './sign-in.resolver';
import { SignInService } from './sign-in.service';

describe('SignInResolver', () => {
  let resolver: SignInResolver;

  const mockSignInService = {
    processAuthTokenGeneration: jest.fn(),
    getUserGoogleInfo: jest.fn(),
    generateAuthToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInResolver,
        {
          provide: SignInService,
          useValue: mockSignInService,
        },
      ],
    }).compile();

    resolver = module.get<SignInResolver>(SignInResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
