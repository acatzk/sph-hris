import { ChangeShiftRequest } from './change_shift_request';
import { EslChangeShiftRequest } from './esl_change_shift_request';
import { EslOffset } from './esl_offset';
import { Leave } from './leave';
import { Overtime } from './overtime';
import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Notification {
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

  @ApiPropertyOptional({ type: () => ChangeShiftRequest })
  changeShiftRequest?: ChangeShiftRequest;

  @ApiPropertyOptional({ type: () => EslChangeShiftRequest })
  eslChangeShiftRequest?: EslChangeShiftRequest;

  @ApiPropertyOptional({ type: () => EslOffset })
  eslOffset?: EslOffset;

  @ApiPropertyOptional({ type: () => Leave })
  leave?: Leave;

  @ApiPropertyOptional({ type: () => Overtime })
  overtime?: Overtime;

  @ApiPropertyOptional({ type: () => User })
  user?: User;
}
