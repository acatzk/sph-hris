import { MultiProject } from './multi_project';
import { Notification } from './notification';
import { TimeEntry } from './time_entry';
import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Overtime {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiPropertyOptional({ type: Number })
  managerId?: number;

  @ApiPropertyOptional({ type: String })
  otherProject?: string;

  @ApiPropertyOptional({ type: String })
  remarks?: string;

  @ApiProperty({ type: Date })
  overtimeDate: Date;

  @ApiProperty({ type: Number })
  requestedMinutes: number;

  @ApiPropertyOptional({ type: Number })
  approvedMinutes?: number;

  @ApiPropertyOptional({ type: Boolean })
  isLeaderApproved?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  isManagerApproved?: boolean;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: Number })
  timeEntryId: number;

  @ApiPropertyOptional({ type: String })
  managerRemarks?: string;

  @ApiProperty({ isArray: true, type: () => MultiProject })
  multiProjects: MultiProject[];

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];

  @ApiProperty({ type: () => TimeEntry })
  timeEntry: TimeEntry;

  @ApiPropertyOptional({ type: () => User })
  manager?: User;

  @ApiProperty({ type: () => User })
  user: User;
}
