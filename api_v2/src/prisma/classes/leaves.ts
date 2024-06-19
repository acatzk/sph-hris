import { LeaveTypes } from './leave_types';
import { Projects } from './projects';
import { Users } from './users';
import { MultiProjects } from './multi_projects';
import { Notifications } from './notifications';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Leaves {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiPropertyOptional({ type: Number })
  projectId?: number;

  @ApiProperty({ type: Number })
  leaveTypeId: number;

  @ApiPropertyOptional({ type: Number })
  managerId?: number;

  @ApiPropertyOptional({ type: String })
  otherProject?: string;

  @ApiPropertyOptional({ type: String })
  reason?: string;

  @ApiProperty({ type: Date })
  leaveDate: Date;

  @ApiProperty({ type: Boolean })
  isWithPay: boolean;

  @ApiPropertyOptional({ type: Boolean })
  isLeaderApproved?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  isManagerApproved?: boolean;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: Number })
  days: number;

  @ApiProperty({ type: Boolean })
  isDeleted: boolean;

  @ApiProperty({ type: () => LeaveTypes })
  leaveType: LeaveTypes;

  @ApiPropertyOptional({ type: () => Projects })
  project?: Projects;

  @ApiPropertyOptional({ type: () => Users })
  manager?: Users;

  @ApiProperty({ type: () => Users })
  user: Users;

  @ApiProperty({ isArray: true, type: () => MultiProjects })
  multiProjects: MultiProjects[];

  @ApiProperty({ isArray: true, type: () => Notifications })
  notifications: Notifications[];
}
