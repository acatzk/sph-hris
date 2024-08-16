import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OvertimeService {
  constructor(private readonly prisma: PrismaService) {}

  // Fetch all overtime entries
  async getAllOvertime() {
    const overtimes = await this.prisma.overtime.findMany({
      include: {
        multiProjects: {
          include: {
            project: true,
          },
        },
        manager: true,
        user: {
          include: {
            role: true,
          },
        },
      },
    });

    // Manually map the overtimes and add roleName
    return overtimes.map((overtime) => ({
      ...overtime,
      user: {
        ...overtime.user,
        roleName: overtime.user.role ? overtime.user.role.name : null,
      },
    }));
  }

  // Fetch overtime entries by user ID
  async getOvertimeByUser(userId: number) {
    return this.prisma.overtime.findMany({
      where: { userId },
      include: {
        multiProjects: {
          include: {
            project: true,
          },
        },
        user: true,
        manager: true,
      },
    });
  }
}
