import { EslChangeShiftRequest } from './esl_change_shift_request';
import { TimeEntry } from './time_entry';
import { User } from './user';
import { Notification } from './notification';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EslOffset {
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

  @ApiPropertyOptional({ type: () => EslChangeShiftRequest })
  eslChangeShiftRequest?: EslChangeShiftRequest;

  @ApiProperty({ type: () => TimeEntry })
  timeEntry: TimeEntry;

  @ApiProperty({ type: () => User })
  teamLeader: User;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ isArray: true, type: () => Notification })
  notifications: Notification[];
}
