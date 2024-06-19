import { ChangeShiftRequests } from './change_shift_requests';
import { EslChangeShiftRequests } from './esl_change_shift_requests';
import { EslOffsets } from './esl_offsets';
import { Leaves } from './leaves';
import { Overtimes } from './overtimes';
import { Users } from './users';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Notifications {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional({ type: Number })
  recipientId?: number;

  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  data: string;

  @ApiPropertyOptional({ type: Date })
  readAt?: Date;

  @ApiProperty({ type: Boolean })
  isRead: boolean;

  @ApiPropertyOptional({ type: Number })
  leaveId?: number;

  @ApiPropertyOptional({ type: Date })
  createdAt?: Date;

  @ApiPropertyOptional({ type: Date })
  updatedAt?: Date;

  @ApiProperty({ type: String })
  discriminator: string = "N''";

  @ApiPropertyOptional({ type: Number })
  overtimeId?: number;

  @ApiPropertyOptional({ type: Number })
  changeShiftRequestId?: number;

  @ApiPropertyOptional({ type: Number })
  eslChangeShiftRequestId?: number;

  @ApiPropertyOptional({ type: Number })
  eslOffsetId?: number;

  @ApiPropertyOptional({ type: Number })
  relatedEntityId?: number;

  @ApiPropertyOptional({ type: () => ChangeShiftRequests })
  changeShiftRequest?: ChangeShiftRequests;

  @ApiPropertyOptional({ type: () => EslChangeShiftRequests })
  eslChangeShiftRequest?: EslChangeShiftRequests;

  @ApiPropertyOptional({ type: () => EslOffsets })
  eslOffset?: EslOffsets;

  @ApiPropertyOptional({ type: () => Leaves })
  leave?: Leaves;

  @ApiPropertyOptional({ type: () => Overtimes })
  overtime?: Overtimes;

  @ApiPropertyOptional({ type: () => Users })
  user?: Users;
}
