import { TimeEntries } from './time_entries';
import { Users } from './users';
import { EslOffsets } from './esl_offsets';
import { Notifications } from './notifications';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EslChangeShiftRequests {
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

  @ApiProperty({ type: () => TimeEntries })
  timeEntry: TimeEntries;

  @ApiProperty({ type: () => Users })
  teamLeader: Users;

  @ApiProperty({ type: () => Users })
  user: Users;

  @ApiProperty({ isArray: true, type: () => EslOffsets })
  eslOffsets: EslOffsets[];

  @ApiProperty({ isArray: true, type: () => Notifications })
  notifications: Notifications[];
}
