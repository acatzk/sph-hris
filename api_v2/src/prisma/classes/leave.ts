import { LeaveType } from './leave_type';
import { Project } from './project';
import { User } from './user';
import { MultiProject } from './multi_project';
import { Notification } from './notification';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Leave {
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

  @ApiProperty({ type: () => LeaveType })
  leaveType: LeaveType;

  @ApiPropertyOptional({ type: () => Project })
  project?: Project;

  @ApiPropertyOptional({ type: () => User })
  manager?: User;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ isArray: true, type: () => MultiProject })
  multiProjects: MultiProject[];

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];
}
