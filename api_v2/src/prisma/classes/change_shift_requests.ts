import { TimeEntries } from './time_entries';
import { Users } from './users';
import { MultiProjects } from './multi_projects';
import { Notifications } from './notifications';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeShiftRequests {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiProperty({ type: Number })
  timeEntryId: number;

  @ApiProperty({ type: Number })
  managerId: number;

  @ApiProperty({ type: Date })
  timeIn: Date;

  @ApiProperty({ type: Date })
  timeOut: Date;

  @ApiPropertyOptional({ type: String })
  otherProject?: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiPropertyOptional({ type: Boolean })
  isManagerApproved?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  isLeaderApproved?: boolean;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: () => TimeEntries })
  timeEntry: TimeEntries;

  @ApiProperty({ type: () => Users })
  manager: Users;

  @ApiProperty({ type: () => Users })
  user: Users;

  @ApiProperty({ isArray: true, type: () => MultiProjects })
  multiProjects: MultiProjects[];

  @ApiProperty({ isArray: true, type: () => Notifications })
  notifications: Notifications[];
}
