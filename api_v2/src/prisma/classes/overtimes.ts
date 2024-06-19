import { MultiProjects } from './multi_projects';
import { Notifications } from './notifications';
import { TimeEntries } from './time_entries';
import { Users } from './users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Overtimes {
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

  @ApiProperty({ isArray: true, type: () => MultiProjects })
  multiProjects: MultiProjects[];

  @ApiProperty({ isArray: true, type: () => Notifications })
  notifications: Notifications[];

  @ApiProperty({ type: () => TimeEntries })
  timeEntry: TimeEntries;

  @ApiPropertyOptional({ type: () => Users })
  manager?: Users;

  @ApiProperty({ type: () => Users })
  user: Users;
}
