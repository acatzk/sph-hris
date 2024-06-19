import { EslChangeShiftRequests } from './esl_change_shift_requests';
import { TimeEntries } from './time_entries';
import { Users } from './users';
import { Notifications } from './notifications';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EslOffsets {
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
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiPropertyOptional({ type: Boolean })
  isLeaderApproved?: boolean;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiPropertyOptional({ type: Number })
  eslChangeShiftRequestId?: number;

  @ApiProperty({ type: Boolean })
  isUsed: boolean;

  @ApiPropertyOptional({ type: () => EslChangeShiftRequests })
  eslChangeShiftRequest?: EslChangeShiftRequests;

  @ApiProperty({ type: () => TimeEntries })
  timeEntry: TimeEntries;

  @ApiProperty({ type: () => Users })
  teamLeader: Users;

  @ApiProperty({ type: () => Users })
  user: Users;

  @ApiProperty({ isArray: true, type: () => Notifications })
  notifications: Notifications[];
}
