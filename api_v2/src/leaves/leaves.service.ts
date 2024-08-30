import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeavesService {
  constructor(private readonly prisma: PrismaService) {}
  async allLeaves() {
    const leaves = await this.prisma.leave.findMany({
      include: {
        user: {
          include: {
            role: true,
          },
        },
        leaveType: true,
        manager: true,
      },
    });

    return leaves.map((leave) => ({
      id: leave.id,
      userId: leave.userId,
      userName: leave.user.name,
      userRole: leave.user.role.name,
      leaveType: leave.leaveType.name,
      manager: leave.manager?.name,
      reason: leave.reason,
      leaveDate: leave.leaveDate,
      isWithPay: leave.isWithPay,
      isLeaderApproved: leave.isLeaderApproved,
      isManagerApproved: leave.isManagerApproved,
      days: leave.days,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt,
      isDeleted: leave.isDeleted,
    }));
  }
}
