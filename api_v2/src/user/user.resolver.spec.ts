import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('userById', () => {
    it('should return a user if a valid id is provided', async () => {
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        roleId: 1,
        employeeScheduleId: 1,
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        paidLeaves: 10,
        profileImageId: 1,
        positionId: 1,
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(mockUser);

      const result = await resolver.userById(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(null);

      const result = await resolver.userById(1);
      expect(result).toBeNull();
    });

    it('should throw an error if the service throws an error', async () => {
      jest.spyOn(userService, 'getUserById').mockImplementation(() => {
        throw new Error('Error fetching user');
      });

      await expect(resolver.userById(1)).rejects.toThrow('Error fetching user');
    });
  });
});
