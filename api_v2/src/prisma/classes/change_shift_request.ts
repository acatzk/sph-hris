import { TimeEntry } from './time_entry';
import { User } from './user';
import { MultiProject } from './multi_project';
import { Notification } from './notification';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeShiftRequest {
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

  @ApiProperty({ type: () => TimeEntry })
  timeEntry: TimeEntry;

  @ApiProperty({ type: () => User })
  manager: User;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ isArray: true, type: () => MultiProject })
  multiProjects: MultiProject[];

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];
}
