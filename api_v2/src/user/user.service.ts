import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //Gets all users before querying
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        role: true,
        position: true,
        employeeSchedule: true,
        timeEntries: true,
        media: true,
        overtimesAsUser: true,
      },
    });
  }

  //Gets the users by ID before querying
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        position: true,
        employeeSchedule: true,
        timeEntries: true,
        media: true,
        overtimesAsUser: true,
      },
    });
  }
}
