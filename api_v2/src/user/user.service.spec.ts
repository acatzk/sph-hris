import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
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

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUser);

      const result = await service.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      const result = await service.getUserById(1);
      expect(result).toBeNull();
    });

    it('should throw an error if an invalid id is provided', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockImplementation(() => {
        throw new Error('Invalid id');
      });

      await expect(service.getUserById(-1)).rejects.toThrow('Invalid id');
    });
  });
});
