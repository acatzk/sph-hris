import { TimeEntry } from './time_entry';
import { User } from './user';
import { EslOffset } from './esl_offset';
import { Notification } from './notification';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EslChangeShiftRequest {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  userId: number;

  @ApiProperty({ type: Number })
  timeEntryId: number;

  @ApiProperty({ type: Number })
  teamLeaderId: number;

  @ApiProperty({ type: Date })
  timeIn: Date;

  @ApiProperty({ type: Date })
  timeOut: Date;

  @ApiProperty({ type: String })
  description: string;

  @ApiPropertyOptional({ type: Boolean })
  isLeaderApproved?: boolean;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: () => TimeEntry })
  timeEntry: TimeEntry;

  @ApiProperty({ type: () => User })
  teamLeader: User;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ isArray: true, type: () => EslOffset })
  eslOffsets: EslOffset[];

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];
}
